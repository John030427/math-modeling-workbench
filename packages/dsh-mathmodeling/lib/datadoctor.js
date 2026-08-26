/** Data Doctor — real CSV diagnosis per PRD §15. No raw JSON as UI output shape. */

export function parseCSV(text) {
  const rows = []
  let row = []
  let field = ''
  let inQuotes = false
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"'
          i++
        } else inQuotes = false
      } else field += ch
    } else if (ch === '"') {
      inQuotes = true
    } else if (ch === ',') {
      row.push(field)
      field = ''
    } else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && text[i + 1] === '\n') i++
      row.push(field)
      field = ''
      if (row.length > 1 || row[0] !== '') rows.push(row)
      row = []
    } else {
      field += ch
    }
  }
  row.push(field)
  if (row.length > 1 || row[0] !== '') rows.push(row)
  if (rows.length === 0) return { headers: [], rows: [] }
  const [headers, ...data] = rows
  return { headers, rows: data }
}

function asNumber(v) {
  if (v === '' || v == null) return null
  const n = Number(v)
  return Number.isFinite(n) ? n : null
}

function looksLikeDate(v) {
  return /^\d{4}[-/]\d{1,2}([-/]\d{1,2})?/.test(v) || /^\d{1,2}\/\d{1,2}\/\d{2,4}$/.test(v)
}

/**
 * @param {string} csv raw text
 * @param {{target?: string}} opts
 * @returns {{columns: Array, findings: Array, recommendations: Array, row_count: number}}
 */
export function diagnose(csv, opts = {}) {
  const { headers, rows } = parseCSV(csv)
  if (headers.length === 0) return { columns: [], findings: [], recommendations: [], row_count: 0 }
  const target = opts.target && headers.includes(opts.target) ? opts.target : null
  const columns = []
  const findings = []
  const recommendations = []

  const colValues = headers.map((_, j) => rows.map((r) => r[j] ?? ''))

  for (let j = 0; j < headers.length; j++) {
    const name = headers[j]
    const vals = colValues[j]
    const missing = vals.filter((v) => v === '' || v == null).length
    const nonMissing = vals.filter((v) => v !== '' && v != null)
    const numbers = nonMissing.map(asNumber).filter((v) => v !== null)
    const numericRatio = nonMissing.length ? numbers.length / nonMissing.length : 0
    const dateLike = nonMissing.filter((v) => looksLikeDate(v)).length
    const isDate = nonMissing.length > 0 && dateLike / nonMissing.length > 0.8
    const isNumeric = numericRatio > 0.85
    const unique = new Set(nonMissing).size

    const col = {
      name,
      type: isDate ? 'date' : isNumeric ? 'numeric' : 'categorical',
      missing,
      missing_pct: round((missing / Math.max(1, vals.length)) * 100),
      unique,
    }
    if (isNumeric && numbers.length > 0) {
      const sorted = [...numbers].sort((a, b) => a - b)
      const mean = numbers.reduce((s, x) => s + x, 0) / numbers.length
      const std = Math.sqrt(numbers.reduce((s, x) => s + (x - mean) ** 2, 0) / Math.max(1, numbers.length - 1))
      const q1 = sorted[Math.floor((sorted.length - 1) * 0.25)]
      const q3 = sorted[Math.floor((sorted.length - 1) * 0.75)]
      const iqr = q3 - q1
      const outliers = numbers.filter((x) => x < q1 - 1.5 * iqr || x > q3 + 1.5 * iqr).length
      col.min = round(sorted[0])
      col.max = round(sorted[sorted.length - 1])
      col.mean = round(mean)
      col.std = round(std)
      col.outliers = outliers
      col.outlier_pct = round((outliers / numbers.length) * 100)
      col.scale_gap = Math.abs(col.max) > 1000 * Math.max(1e-6, Math.abs(col.min) || 1)
      if (unique <= 1) {
        col.constant = true
        findings.push({ severity: 'high', code: 'constant-column', column: name, detail: '该列只有一个取值，不携带信息量' })
      }
      if (outliers / numbers.length > 0.05) {
        findings.push({ severity: 'medium', code: 'outliers', column: name, detail: `IQR 法检出 ${outliers} 个离群值（${col.outlier_pct}%）` })
        recommendations.push({
          action: `检查 ${name} 的离群值来源`,
          why: '离群值会拉动均值型统计量与距离类模型（K-Means/线性回归）',
          risk: '直接删除可能丢掉真实极端情形',
          when_not: '若离群值是业务上真实且重要的样本，应保留并改用稳健模型',
        })
      }
      if (col.missing_pct > 30) {
        findings.push({ severity: 'high', code: 'heavy-missing', column: name, detail: `缺失 ${col.missing_pct}%` })
        recommendations.push({
          action: `${name} 缺失超过 30%：考虑删除该列或做缺失指示特征`,
          why: '大量缺失的列插补会引入人为分布',
          risk: '删除会损失信息',
          when_not: '缺失本身有业务含义（ informative missingness）时应保留并编码',
        })
      } else if (col.missing > 0) {
        findings.push({ severity: 'low', code: 'missing', column: name, detail: `缺失 ${col.missing} 个（${col.missing_pct}%）` })
        recommendations.push({
          action: `${name} 缺失值需要处理（数值：中位数；类别：众数或“缺失”类）`,
          why: '多数模型不能直接处理缺失',
          risk: '插补会低估不确定性',
          when_not: '树模型对缺失较鲁棒时可先保留',
        })
      }
    }
    if (isDate) {
      const ordered = vals.every((v, i) => i === 0 || String(vals[i - 1]) <= String(v))
      col.temporal_ordered = ordered
      findings.push({
        severity: ordered ? 'low' : 'medium',
        code: ordered ? 'temporal-order' : 'temporal-unordered',
        column: name,
        detail: ordered ? '时间列已按行序递增' : '时间列非单调，注意时序切分不能按行号',
      })
      if (!ordered) {
        recommendations.push({
          action: `按 ${name} 排序后再做时序验证切分`,
          why: '乱序数据按行切分会造成时间泄漏',
          risk: '排序会改变样本独立性假设',
          when_not: '非时序问题可忽略',
        })
      }
    }
    columns.push(col)
  }

  // leakage heuristics
  if (target) {
    const ti = headers.indexOf(target)
    for (let j = 0; j < headers.length; j++) {
      if (j === ti) continue
      const same = colValues[j].every((v, i) => v === colValues[ti][i])
      if (same) {
        findings.push({ severity: 'critical', code: 'target-leakage', column: headers[j], detail: `特征列与目标列 ${target} 完全相同 — 数据泄漏` })
        recommendations.push({
          action: `删除特征 ${headers[j]}（与目标完全相同）`,
          why: '这是目标泄漏，会让离线指标虚高、线上失效',
          risk: '无',
          when_not: '无 — 必须删除',
        })
      }
      if (headers[j].toLowerCase().includes(target.toLowerCase()) && headers[j] !== target) {
        findings.push({ severity: 'medium', code: 'suspected-leakage', column: headers[j], detail: `特征名包含目标词「${target}」，检查是否由目标衍生` })
      }
    }
  } else {
    recommendations.push({
      action: '指定目标列后重新诊断（可检测目标泄漏）',
      why: '泄漏检测需要知道目标',
      risk: '无',
      when_not: '无目标的无监督任务可跳过',
    })
  }

  return { row_count: rows.length, columns, findings, recommendations }
}

function round(x) {
  return Number.isFinite(x) ? Math.round(x * 1e4) / 1e4 : x
}
