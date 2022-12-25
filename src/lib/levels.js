const constant = 700;
const coef = 200;

export function getLevel(exp) {
  const allExp = [];
  let prev = 500;
  let i = 1;

  while (exp >= prev) {
    const result = Math.round(prev + constant + (i - 1) * coef);
    allExp.push(result);
    prev = result;
    i += 1;
  }

  const prevStep = i - 3;
  const expStep = prev - allExp[prevStep];
  const currentExp = exp - allExp[prevStep];

  return {
    totalExp: exp,
    currentExp: currentExp || 0,
    currentLevel: i - 1,
    nextLevel: i,
    progress: Math.round((currentExp * 100) / expStep) || 0,
    nextNeeded: expStep || prev,
  };
}

export function getNextLevelPercent() {}
