import next from "eslint-config-next";

export default [
  ...next,
  {
    rules: {
      "react-hooks/refs": "off",
      "import/no-anonymous-default-export": "off",
    },
  },
];
