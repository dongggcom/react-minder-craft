export const isModelOne = node => node?.data.modelType === 'one';
export const isModelTwo = node => node?.data.modelType === 'two';
export const isRootNode = node => node?.type === 'root';
export const isIllegalNode = node => node === null || node.data.modelType === undefined;
export const isUnknownNode = node => node?.data.modelType === 'unknow';
