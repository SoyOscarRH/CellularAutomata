const getRules = (rules_id: number) => {
  return (s: Uint8Array, i: number) => {
    const limit = s.length - 1;
    const n1 = i === 0 ? limit : i - 1;
    const n2 = i === limit ? 0 : i + 1;

    const id = (s[n1] << 2) + (s[i] << 1) + (s[n2] << 0);
    return (rules_id >> id) & 1;
  };
};

const getLine = (space: Uint8Array, rules_id: number) => {
  const rules = getRules(rules_id);
  return space.map((_, i) => rules(space, i));
};

export { getLine };
