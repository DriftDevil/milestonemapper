// A simple logger to mimic the one in the example code.
const logger = {
    info: (context: string, ...args: any[]) => console.log(`[INFO] [${context}]`, ...args),
    warn: (context: string, ...args: any[]) => console.warn(`[WARN] [${context}]`, ...args),
    error: (context: string, ...args: any[]) => console.error(`[ERROR] [${context}]`, ...args),
};

export default logger;
