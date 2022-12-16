const constant = 700;
const coef = 200;

export function getLevel(exp) {
  let prev = 500;
  let i = 1;

  while (exp >= prev) {
    const result = Math.round(prev + constant + (i - 1) * coef);
    prev = result;
    i += 1;
  }

  return {
    currentExp: exp,
    currentLevel: i - 1,
    nextLevel: i,
    progress: Math.round((exp * 100) / prev),
    nextNeeded: prev,
  };
}

export function getNextLevelPercent() {}
