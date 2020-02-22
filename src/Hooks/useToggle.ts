import { useCallback, useState } from "react";

const useToggle = (initialValue: boolean): [boolean, () => void] => {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => {
    setValue(currentValue => !currentValue);
  }, [setValue]);

  return [value, toggle];
};

export {useToggle};
