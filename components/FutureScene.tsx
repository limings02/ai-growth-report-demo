// 第二屏：未来场景区 —— 让用户脑补 18 岁孩子收到礼物的画面
export default function FutureScene() {
  return (
    <section className="px-5 py-20"
      style={{ background: "linear-gradient(180deg, #fdf0e8 0%, #fce8e0 100%)" }}>
      <div className="max-w-3xl mx-auto text-center">

        {/* 标题 */}
        <p className="text-sm font-medium mb-4 tracking-widest" style={{ color: "#c0674a" }}>
          想象一下
        </p>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-10"
          style={{ color: "#2d1f1a", lineHeight: "1.4" }}>
          18 岁那天，他会看到什么？
        </h2>

        {/* 正文诗意段落 */}
        <div className="rounded-3xl p-8 sm:p-12 mb-10 text-left sm:text-center"
          style={{
            background: "#fffaf7",
            border: "1px solid #f0ddd5",
            boxShadow: "0 8px 40px rgba(200, 120, 90, 0.08)"
          }}>
          <div className="space-y-4 text-base sm:text-lg leading-loose"
            style={{ color: "#5a3d35" }}>
            <p>第一次走路时摔倒又爬起来的样子，</p>
            <p>第一次上学前你帮他整理书包的早晨，</p>
            <p>小时候最喜欢抱着睡觉的那只玩具熊，</p>
            <p>你曾经写给他的那句悄悄话，</p>
            <p className="font-medium" style={{ color: "#7a5a52" }}>
              还有那些他已经不记得、<br className="sm:hidden" />但你一直认真记得的瞬间。
            </p>
          </div>
        </div>

        {/* 强调句 */}
        <p className="text-base sm:text-lg font-semibold" style={{ color: "#e07a5f" }}>
          这些不是普通照片，<br className="sm:hidden" />
          而是他理解自己如何长大的证据。
        </p>
      </div>
    </section>
  );
}
