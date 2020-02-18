const getBase = (size: number) => {
  const base = Math.floor((window.innerWidth * 0.7) / size);
  const nearest10 = ((base - (base % 10)) / 10) * 10;

  return nearest10;
};

type hookFn = React.Dispatch<React.SetStateAction<number>>;
type click = React.ChangeEvent<HTMLInputElement>;
const bindIt = (setX: hookFn) => (e: click) => setX(Number(e.target.value));


export {getBase, bindIt}