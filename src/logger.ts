import { createConsola } from "consola";

const logger = createConsola({
  level: 4,
  formatOptions: {
      columns: 80,
      colors: true,
      compact: true,
      date: true,
  },
});

export default logger
