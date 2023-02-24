# ⚠ Experimental

ここは SmartHR UI に展開するかどうか決まっていないが、素早くプロダクションでも試してみるための実験場です。

すべてのコンポーネントは実験的に実装しているため、十分注意して使ってください。突然消える可能性もあります。

## 開発者へ

長い期間、実験場に置くことは推奨していません。素早く試し、用が済んだら適切な場所に移すか消してください。

実験的なコンポーネントであることを理解しやすくするため、必ず `smarthr-ui/lib/components/Experimental` から明示的に `import` して使いましょう。`src/index.ts` で `export` は行わないでください。