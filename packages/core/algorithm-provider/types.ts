/** Algorithm execution boundary — implementations: local-provider, czy-provider, … */

export interface AlgorithmDescriptor {
  id: string
  name: string
  family: string
  description?: string
}

export interface ExperimentResult {
  algorithm: string
  seed?: number
  metrics: Record<string, number>
  artifacts?: Record<string, string>
  log?: string[]
  error?: string
}

export interface AlgorithmProvider {
  listAlgorithms(): Promise<AlgorithmDescriptor[]>

  runAlgorithm(input: {
    algorithm: string
    dataset?: string
    parameters: Record<string, unknown>
    seed?: number
  }): Promise<ExperimentResult>
}

/** Mock provider for spike / tests — no external deps. */
export const mockAlgorithmProvider: AlgorithmProvider = {
  async listAlgorithms() {
    return [
      { id: 'kmeans', name: 'K-Means', family: 'clustering' },
      { id: 'topsis', name: 'TOPSIS', family: 'evaluation' },
    ]
  },
  async runAlgorithm(input) {
    return {
      algorithm: input.algorithm,
      seed: input.seed,
      metrics: { score: 0.75, runtime_ms: 12 },
      log: [`mock run ${input.algorithm}`],
    }
  },
}
