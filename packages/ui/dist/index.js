import { useEffect, useMemo, useRef, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region src/KMeansCanvas.tsx
function mulberry32(a) {
	return function() {
		let t = a += 1831565813;
		t = Math.imul(t ^ t >>> 15, t | 1);
		t ^= t + Math.imul(t ^ t >>> 7, t | 61);
		return ((t ^ t >>> 14) >>> 0) / 4294967296;
	};
}
function genPoints(seed, k) {
	const rnd = mulberry32(seed);
	const centers = Array.from({ length: k }, () => ({
		x: 80 + rnd() * 440,
		y: 60 + rnd() * 280
	}));
	const pts = [];
	for (let i = 0; i < 90; i++) {
		const c = centers[i % k];
		pts.push({
			x: c.x + (rnd() - .5) * 90,
			y: c.y + (rnd() - .5) * 90,
			cluster: -1
		});
	}
	return pts;
}
function KMeansCanvas() {
	const canvasRef = useRef(null);
	const [k, setK] = useState(3);
	const [seed, setSeed] = useState(7);
	const [step, setStep] = useState(0);
	const [auto, setAuto] = useState(false);
	const points = useMemo(() => genPoints(seed, k), [seed, k]);
	const [centroids, setCentroids] = useState([]);
	const [assigned, setAssigned] = useState([]);
	const [phase, setPhase] = useState("init");
	useEffect(() => {
		const rnd = mulberry32(seed + 99);
		const cs = Array.from({ length: k }, () => ({
			x: 60 + rnd() * 480,
			y: 40 + rnd() * 320
		}));
		setCentroids(cs);
		setAssigned(points.map((p) => ({
			...p,
			cluster: -1
		})));
		setPhase("init");
		setStep(0);
	}, [
		k,
		seed,
		points
	]);
	useEffect(() => {
		const c = canvasRef.current;
		if (!c) return;
		const ctx = c.getContext("2d");
		if (!ctx) return;
		ctx.clearRect(0, 0, c.width, c.height);
		ctx.strokeStyle = "rgba(128,128,128,0.12)";
		for (let x = 0; x < c.width; x += 40) {
			ctx.beginPath();
			ctx.moveTo(x, 0);
			ctx.lineTo(x, c.height);
			ctx.stroke();
		}
		for (let y = 0; y < c.height; y += 40) {
			ctx.beginPath();
			ctx.moveTo(0, y);
			ctx.lineTo(c.width, y);
			ctx.stroke();
		}
		const colors = [
			"#c45c26",
			"#1f7a6c",
			"#2a5085",
			"#8a4f2a",
			"#5b4b8a"
		];
		assigned.forEach((p) => {
			ctx.beginPath();
			ctx.fillStyle = p.cluster < 0 ? "rgba(128,128,128,0.45)" : colors[p.cluster % colors.length];
			ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
			ctx.fill();
		});
		centroids.forEach((ct, i) => {
			ctx.beginPath();
			ctx.strokeStyle = colors[i % colors.length];
			ctx.lineWidth = 2;
			ctx.moveTo(ct.x - 8, ct.y);
			ctx.lineTo(ct.x + 8, ct.y);
			ctx.moveTo(ct.x, ct.y - 8);
			ctx.lineTo(ct.x, ct.y + 8);
			ctx.stroke();
			ctx.beginPath();
			ctx.arc(ct.x, ct.y, 10, 0, Math.PI * 2);
			ctx.stroke();
		});
	}, [assigned, centroids]);
	function assignStep() {
		const next = assigned.map((p) => {
			let best = 0;
			let bestD = Infinity;
			centroids.forEach((c, i) => {
				const d = (p.x - c.x) ** 2 + (p.y - c.y) ** 2;
				if (d < bestD) {
					bestD = d;
					best = i;
				}
			});
			return {
				...p,
				cluster: best
			};
		});
		setAssigned(next);
		setPhase("assign");
		setStep((s) => s + 1);
	}
	function updateStep() {
		const next = centroids.map((_, i) => {
			const members = assigned.filter((p) => p.cluster === i);
			if (!members.length) return centroids[i];
			return {
				x: members.reduce((a, p) => a + p.x, 0) / members.length,
				y: members.reduce((a, p) => a + p.y, 0) / members.length
			};
		});
		const moved = next.some((c, i) => Math.hypot(c.x - centroids[i].x, c.y - centroids[i].y) > .5);
		setCentroids(next);
		setPhase(moved ? "update" : "done");
		setStep((s) => s + 1);
	}
	function next() {
		if (phase === "init" || phase === "update") assignStep();
		else if (phase === "assign") updateStep();
	}
	useEffect(() => {
		if (!auto || phase === "done") return;
		const t = setTimeout(next, 700);
		return () => clearTimeout(t);
	}, [
		auto,
		phase,
		step
	]);
	return /* @__PURE__ */ jsxs("div", {
		className: "mm-panel",
		children: [
			/* @__PURE__ */ jsxs("div", {
				style: {
					display: "flex",
					flexWrap: "wrap",
					gap: 8,
					marginBottom: 12,
					alignItems: "center"
				},
				children: [
					/* @__PURE__ */ jsxs("label", {
						className: "mm-muted",
						children: ["K=", /* @__PURE__ */ jsx("input", {
							type: "number",
							min: 2,
							max: 5,
							value: k,
							onChange: (e) => setK(Number(e.target.value)),
							style: {
								marginLeft: 6,
								width: 48
							}
						})]
					}),
					/* @__PURE__ */ jsx("button", {
						className: "mm-btn ghost",
						type: "button",
						onClick: () => setSeed((s) => s + 1),
						children: "随机初始化"
					}),
					/* @__PURE__ */ jsx("button", {
						className: "mm-btn ghost",
						type: "button",
						onClick: next,
						disabled: phase === "done",
						children: "下一步"
					}),
					/* @__PURE__ */ jsx("button", {
						className: "mm-btn",
						type: "button",
						onClick: () => setAuto((a) => !a),
						children: auto ? "暂停" : "自动运行"
					}),
					/* @__PURE__ */ jsxs("span", {
						className: "mm-chip",
						children: [
							"step ",
							step,
							" · ",
							phase
						]
					})
				]
			}),
			/* @__PURE__ */ jsx("canvas", {
				ref: canvasRef,
				width: 600,
				height: 400,
				style: {
					width: "100%",
					maxWidth: "100%"
				}
			}),
			/* @__PURE__ */ jsx("p", {
				className: "mm-muted",
				style: { marginTop: 8 },
				children: "流程：随机初始中心 → 分配最近簇 → 更新中心 → 重复至收敛。叉号为质心。"
			})
		]
	});
}
//#endregion
//#region src/AtlasView.tsx
function AtlasView({ models, onSelectModel }) {
	return /* @__PURE__ */ jsxs("div", { children: [
		/* @__PURE__ */ jsx("h2", {
			className: "mm-title",
			children: "模型地图"
		}),
		/* @__PURE__ */ jsx("p", {
			className: "mm-muted",
			children: "按 Registry 浏览算法模型。K-Means 为完整互动课程示范。"
		}),
		/* @__PURE__ */ jsx("div", {
			className: "mm-grid",
			style: { marginTop: 16 },
			children: models.map((m) => /* @__PURE__ */ jsxs("div", {
				className: "mm-card",
				onClick: () => onSelectModel(m.id),
				children: [
					/* @__PURE__ */ jsx("div", { children: (m.category?.task || []).map((t) => /* @__PURE__ */ jsx("span", {
						className: "mm-chip",
						children: t
					}, t)) }),
					/* @__PURE__ */ jsx("div", {
						className: "mm-title",
						style: { fontSize: "1.1rem" },
						children: m.name_zh || m.name
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mm-muted",
						children: m.summary
					}),
					m.id === "kmeans" && /* @__PURE__ */ jsx("div", {
						className: "mm-muted",
						style: {
							marginTop: 8,
							color: "var(--mm-accent)"
						},
						children: "★ 演示重点：互动课程"
					})
				]
			}, m.id))
		})
	] });
}
//#endregion
//#region src/KMeansLesson.tsx
const STEPS = [
	"30秒直觉",
	"现实案例",
	"交互动画",
	"数学原理",
	"代码",
	"适用条件",
	"不适用条件",
	"常见错误",
	"模型比较",
	"Mini Quiz"
];
function KMeansLesson({ model, api, onBack, onAskTutor, sessionId }) {
	const [step, setStep] = useState(1);
	const [quizzes, setQuizzes] = useState([]);
	const [selected, setSelected] = useState({});
	const [results, setResults] = useState({});
	useEffect(() => {
		api.patchContext({
			page: "lesson/kmeans",
			model_id: "kmeans",
			lesson_step: step,
			route: `/mathmodeling/atlas/kmeans`,
			session_id: sessionId
		});
	}, [
		step,
		sessionId,
		api
	]);
	useEffect(() => {
		api.fetchQuizzes("kmeans").then((r) => setQuizzes(r.questions)).catch(() => setQuizzes([]));
	}, [api]);
	function goStep(n) {
		setStep(n);
		api.patchContext({
			page: "lesson/kmeans",
			model_id: "kmeans",
			lesson_step: n,
			session_id: sessionId
		});
	}
	function ask(seedPrompt, knowledgeUnit) {
		api.patchContext({
			page: "lesson/kmeans",
			model_id: "kmeans",
			knowledge_unit: knowledgeUnit ?? null,
			lesson_step: step,
			seed_prompt: seedPrompt,
			session_id: sessionId
		});
		onAskTutor({
			seedPrompt,
			knowledgeUnit,
			lessonStep: step
		});
	}
	return /* @__PURE__ */ jsxs("div", { children: [
		/* @__PURE__ */ jsx("button", {
			type: "button",
			className: "mm-btn ghost",
			onClick: onBack,
			children: "← 模型地图"
		}),
		/* @__PURE__ */ jsx("h2", {
			className: "mm-title",
			style: { marginTop: 12 },
			children: model.name_zh || model.name
		}),
		/* @__PURE__ */ jsx("p", {
			className: "mm-muted",
			children: model.summary
		}),
		/* @__PURE__ */ jsx("div", {
			className: "mm-steps",
			children: STEPS.map((label, i) => {
				const n = i + 1;
				return /* @__PURE__ */ jsxs("button", {
					type: "button",
					className: `mm-chip ${step === n ? "active" : ""}`,
					style: {
						cursor: "pointer",
						border: "none"
					},
					onClick: () => goStep(n),
					children: [
						n,
						". ",
						label
					]
				}, n);
			})
		}),
		/* @__PURE__ */ jsxs("div", {
			className: "mm-panel",
			children: [
				step === 1 && /* @__PURE__ */ jsxs("div", { children: [
					/* @__PURE__ */ jsx("h3", {
						className: "mm-title",
						children: "30 秒直觉"
					}),
					/* @__PURE__ */ jsx("p", {
						style: {
							marginTop: 12,
							lineHeight: 1.6
						},
						children: "它解决什么问题？把「相似」的样本分到同一组，使组内更紧、组间更分离——用到簇中心的距离来衡量。"
					}),
					/* @__PURE__ */ jsx("button", {
						className: "mm-btn",
						type: "button",
						style: { marginTop: 12 },
						onClick: () => ask("它到底解决什么问题？再简单一点。"),
						children: "问 Tutor：再简单一点"
					})
				] }),
				step === 2 && /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
					className: "mm-title",
					children: "现实案例"
				}), /* @__PURE__ */ jsx("p", {
					style: { marginTop: 12 },
					children: "零售客户分群、企业信用分层、问卷受访者画像。先问：分群后运营动作是什么？否则 K 只是数字游戏。"
				})] }),
				step === 3 && /* @__PURE__ */ jsxs("div", { children: [
					/* @__PURE__ */ jsx("h3", {
						className: "mm-title",
						children: "交互动画"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mm-muted",
						children: "随机中心 → 分配 → 更新 → 收敛。可改 K、自动运行。"
					}),
					/* @__PURE__ */ jsx(KMeansCanvas, {})
				] }),
				step === 4 && /* @__PURE__ */ jsxs("div", { children: [
					/* @__PURE__ */ jsx("h3", {
						className: "mm-title",
						children: "数学原理"
					}),
					/* @__PURE__ */ jsxs("ul", {
						style: {
							marginTop: 12,
							lineHeight: 1.6,
							fontSize: "0.875rem"
						},
						children: [
							/* @__PURE__ */ jsx("li", { children: "距离：常用欧氏距离 ‖x − c‖" }),
							/* @__PURE__ */ jsx("li", { children: "质心：簇内样本均值" }),
							/* @__PURE__ */ jsx("li", { children: "目标：最小化 SSE = Σ ‖xi − c_zi‖²" }),
							/* @__PURE__ */ jsx("li", { children: "迭代至分配不再变化或位移很小" })
						]
					}),
					/* @__PURE__ */ jsx("button", {
						className: "mm-btn ghost",
						type: "button",
						style: { marginTop: 12 },
						onClick: () => ask("SSE 是怎么来的？", "sse"),
						children: "问 Tutor：SSE 怎么来的？"
					})
				] }),
				step === 5 && /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
					className: "mm-title",
					children: "代码"
				}), /* @__PURE__ */ jsx("pre", {
					className: "mm-code",
					children: `from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler

X = StandardScaler().fit_transform(raw_features)
km = KMeans(n_clusters=3, n_init=10, random_state=0)
labels = km.fit_predict(X)`
				})] }),
				step === 6 && /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
					className: "mm-title",
					children: "什么时候适合"
				}), /* @__PURE__ */ jsx("ul", {
					style: {
						marginTop: 12,
						paddingLeft: 20
					},
					children: (model.use_when || []).map((x) => /* @__PURE__ */ jsx("li", { children: x }, x))
				})] }),
				step === 7 && /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
					className: "mm-title",
					children: "什么时候不适合"
				}), /* @__PURE__ */ jsx("ul", {
					style: {
						marginTop: 12,
						paddingLeft: 20
					},
					children: (model.avoid_when || []).map((x) => /* @__PURE__ */ jsx("li", { children: x }, x))
				})] }),
				step === 8 && /* @__PURE__ */ jsxs("div", { children: [
					/* @__PURE__ */ jsx("h3", {
						className: "mm-title",
						children: "常见错误"
					}),
					/* @__PURE__ */ jsx("ul", {
						style: {
							marginTop: 12,
							paddingLeft: 20
						},
						children: (model.common_mistakes || []).map((x) => /* @__PURE__ */ jsx("li", { children: x }, x))
					}),
					/* @__PURE__ */ jsx("button", {
						className: "mm-btn",
						type: "button",
						style: { marginTop: 12 },
						onClick: () => ask("为什么要标准化？", "feature-scaling"),
						children: "问 Tutor：为什么要标准化？"
					})
				] }),
				step === 9 && /* @__PURE__ */ jsxs("div", { children: [
					/* @__PURE__ */ jsx("h3", {
						className: "mm-title",
						children: "模型比较"
					}),
					/* @__PURE__ */ jsxs("p", {
						style: { marginTop: 12 },
						children: ["备选：", (model.alternatives || []).join(", ") || "—"]
					}),
					/* @__PURE__ */ jsx("button", {
						className: "mm-btn ghost",
						type: "button",
						style: { marginTop: 12 },
						onClick: () => ask("那 DBSCAN 呢？", "kmeans-vs-dbscan"),
						children: "问 Tutor：那 DBSCAN 呢？"
					})
				] }),
				step === 10 && /* @__PURE__ */ jsxs("div", { children: [
					/* @__PURE__ */ jsx("h3", {
						className: "mm-title",
						children: "Mini Quiz"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mm-muted",
						children: "提交后更新 knowledge-unit mastery 并持久化。"
					}),
					/* @__PURE__ */ jsxs("div", {
						style: { marginTop: 16 },
						children: [quizzes.map((q) => /* @__PURE__ */ jsxs("div", {
							style: {
								borderTop: "1px solid var(--mm-line)",
								paddingTop: 16,
								marginTop: 16
							},
							children: [
								/* @__PURE__ */ jsxs("span", {
									className: "mm-chip",
									children: [
										"L",
										q.level,
										" · ",
										q.knowledge_unit
									]
								}),
								/* @__PURE__ */ jsx("p", {
									style: {
										fontWeight: 500,
										marginTop: 8
									},
									children: q.prompt
								}),
								/* @__PURE__ */ jsx("div", {
									style: {
										marginTop: 8,
										display: "grid",
										gap: 6
									},
									children: Object.entries(q.options).map(([k, v]) => /* @__PURE__ */ jsxs("label", {
										style: {
											display: "flex",
											gap: 8,
											fontSize: "0.875rem",
											cursor: "pointer"
										},
										children: [/* @__PURE__ */ jsx("input", {
											type: "radio",
											name: q.id,
											checked: selected[q.id] === k,
											onChange: () => setSelected((s) => ({
												...s,
												[q.id]: k
											}))
										}), /* @__PURE__ */ jsxs("span", { children: [
											/* @__PURE__ */ jsxs("b", { children: [k, "."] }),
											" ",
											v
										] })]
									}, k))
								}),
								/* @__PURE__ */ jsx("button", {
									className: "mm-btn ghost",
									type: "button",
									style: { marginTop: 8 },
									disabled: !selected[q.id],
									onClick: async () => {
										const r = await api.submitQuiz({
											quiz_id: `kmeans:${q.id}`,
											selected: selected[q.id],
											item_type: "ku",
											item_id: q.knowledge_unit,
											session_id: sessionId
										});
										setResults((old) => ({
											...old,
											[q.id]: r
										}));
									},
									children: "提交"
								}),
								results[q.id] && /* @__PURE__ */ jsxs("p", {
									className: "mm-muted",
									style: {
										marginTop: 8,
										color: results[q.id].correct ? "var(--mm-accent-2)" : "var(--mm-accent)"
									},
									children: [
										results[q.id].correct ? "正确" : `不对。答案 ${results[q.id].answer}`,
										" — ",
										results[q.id].explanation,
										" · mastery ",
										results[q.id].mastery.toFixed(1)
									]
								})
							]
						}, q.id)), !quizzes.length && /* @__PURE__ */ jsx("p", {
							className: "mm-muted",
							children: "题库加载中…"
						})]
					})
				] })
			]
		})
	] });
}
//#endregion
//#region src/ModelingWorkbench.tsx
const NAV = [
	{
		id: "dashboard",
		label: "Dashboard",
		phase: "P1"
	},
	{
		id: "atlas",
		label: "模型地图",
		phase: "P1"
	},
	{
		id: "lesson",
		label: "K-Means 课程",
		phase: "P1"
	},
	{
		id: "gym",
		label: "专项训练",
		phase: "P2+"
	},
	{
		id: "competition",
		label: "比赛工作台",
		phase: "P6"
	},
	{
		id: "problem-library",
		label: "题库/真题",
		phase: "P4"
	},
	{
		id: "case-library",
		label: "优秀案例",
		phase: "P5"
	},
	{
		id: "paper-reviewer",
		label: "论文评审",
		phase: "P7"
	},
	{
		id: "profile",
		label: "能力画像",
		phase: "P8"
	}
];
function Placeholder({ title, phase }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "mm-panel",
		children: [/* @__PURE__ */ jsx("h3", {
			className: "mm-title",
			children: title
		}), /* @__PURE__ */ jsxs("p", {
			className: "mm-muted",
			children: ["迁移至 conversation.view 内导航 · ", phase]
		})]
	});
}
function ModelingWorkbench({ api, sessionId, onAskTutor, initialSection = "atlas" }) {
	const [section, setSection] = useState(initialSection);
	const [models, setModels] = useState([]);
	const [lessonModel, setLessonModel] = useState(null);
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		api.fetchRegistry().then((r) => setModels(r.models)).catch(() => setModels([])).finally(() => setLoading(false));
	}, [api]);
	useEffect(() => {
		api.patchContext({
			page: {
				dashboard: "dashboard",
				atlas: "atlas",
				lesson: "lesson/kmeans",
				gym: "gym",
				competition: "competition",
				"problem-library": "problem-library",
				"case-library": "case-library",
				"paper-reviewer": "paper-reviewer",
				profile: "profile"
			}[section] ?? section,
			model_id: section === "lesson" ? "kmeans" : null,
			lesson_step: section === "lesson" ? 1 : null,
			route: `/mathmodeling/${section}`,
			session_id: sessionId
		});
	}, [
		section,
		sessionId,
		api
	]);
	async function openModel(id) {
		if (id === "kmeans") {
			const m = await api.fetchModel(id);
			setLessonModel(m);
			setSection("lesson");
		} else api.patchContext({
			page: "atlas",
			model_id: id,
			session_id: sessionId
		});
	}
	if (loading) return /* @__PURE__ */ jsx("p", {
		className: "mm-muted",
		children: "加载中…"
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "mm-root",
		style: {
			padding: "16px 20px",
			height: "100%",
			overflow: "auto"
		},
		children: [
			/* @__PURE__ */ jsxs("p", {
				className: "mm-muted",
				style: { marginBottom: 12 },
				children: ["会话内工作台 · Tutor 请用下方 DSH 对话 + ", /* @__PURE__ */ jsx("code", { children: "/modeling-tutor" })]
			}),
			/* @__PURE__ */ jsx("nav", {
				className: "mm-steps",
				style: { marginBottom: 16 },
				children: NAV.map((item) => /* @__PURE__ */ jsx("button", {
					type: "button",
					className: `mm-chip ${section === item.id ? "active" : ""}`,
					style: {
						cursor: "pointer",
						border: "none"
					},
					onClick: () => {
						setSection(item.id);
						if (item.id !== "lesson") setLessonModel(null);
					},
					children: item.label
				}, item.id))
			}),
			section === "dashboard" && /* @__PURE__ */ jsxs("div", { children: [
				/* @__PURE__ */ jsx("h2", {
					className: "mm-title",
					children: "数模工作台"
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mm-muted",
					children: "通过会话标签「数模工作台」访问（非全局页面）。与「对话」「轨迹」并列。"
				}),
				/* @__PURE__ */ jsx("div", {
					className: "mm-grid",
					style: { marginTop: 16 },
					children: /* @__PURE__ */ jsxs("div", {
						className: "mm-panel",
						children: [/* @__PURE__ */ jsx("h3", {
							className: "mm-title",
							children: "模型地图"
						}), /* @__PURE__ */ jsxs("p", {
							className: "mm-muted",
							children: [models.length, " 个模型"]
						})]
					})
				})
			] }),
			section === "atlas" && /* @__PURE__ */ jsx(AtlasView, {
				models,
				onSelectModel: (id) => void openModel(id)
			}),
			section === "lesson" && lessonModel && /* @__PURE__ */ jsx(KMeansLesson, {
				model: lessonModel,
				api,
				sessionId,
				onBack: () => {
					setSection("atlas");
					setLessonModel(null);
				},
				onAskTutor
			}),
			section === "lesson" && !lessonModel && /* @__PURE__ */ jsx("p", {
				className: "mm-muted",
				children: "请从模型地图打开 K-Means 课程。"
			}),
			section === "gym" && /* @__PURE__ */ jsx(Placeholder, {
				title: "专项训练 (Gym)",
				phase: "P2+"
			}),
			section === "competition" && /* @__PURE__ */ jsx(Placeholder, {
				title: "比赛工作台",
				phase: "P6"
			}),
			section === "problem-library" && /* @__PURE__ */ jsx(Placeholder, {
				title: "题库/真题",
				phase: "P4"
			}),
			section === "case-library" && /* @__PURE__ */ jsx(Placeholder, {
				title: "优秀案例",
				phase: "P5"
			}),
			section === "paper-reviewer" && /* @__PURE__ */ jsx(Placeholder, {
				title: "论文评审",
				phase: "P7"
			}),
			section === "profile" && /* @__PURE__ */ jsx(Placeholder, {
				title: "能力画像",
				phase: "P8"
			})
		]
	});
}
//#endregion
export { AtlasView, KMeansCanvas, KMeansLesson, ModelingWorkbench };
