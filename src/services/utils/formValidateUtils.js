/* validation */
export const maxLength = max => value => value && value.length > max ? `最长: ${max} 字符` : undefined;
export const maxLengthCN = max => value => value && value.length > max ? `最长: ${max} 汉字` : undefined;
export const required = value => (value || typeof value === "number" ? undefined : "必填项");
export const number = value => value && isNaN(Number(value)) ? "须填数字" : undefined;
export const maxLength10CN = maxLengthCN(10); // 最长 10 汉字 入库厂商
export const maxLength100CN = maxLengthCN(100); // 最长 10 汉字 入库厂商
export const maxLength50CN = maxLengthCN(50); // 最长 10 汉字 入库厂商
export const maxLength500CN = maxLengthCN(500); // 最长 500 汉字 入库厂商
export const maxLength1000CN = maxLength(1000);
export const maxLength10 = maxLength(10); // 集团工单号
export const maxLength30 = maxLength(30); // 集团工单号
export const maxLength100 = maxLength(100); // 厂商信息
export const maxLength200 = maxLength(200); // 报签号


// 正整数 - redux form used
export const postInt = value => value && !/^[0-9]*[1-9][0-9]*$/.test(value) ? "需要填写正整数" : undefined;

// ip 地址
export const validateIp = value => value && !/^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/.test(value);

export const validHostname = value => value && !/^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$/gm.test(value);
