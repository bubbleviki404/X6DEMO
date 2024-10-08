/**
 * 计算两个节点之间的角度
 * @param node1_x 第一个节点的 x 坐标
 * @param node1_y 第一个节点的 y 坐标
 * @param node2_x 第二个节点的 x 坐标
 * @param node2_y 第二个节点的 y 坐标
 * @returns 计算得到的角度，范围在 [0, 360) 之间
 */
export function getAngle(
  node1_x: number,
  node1_y: number,
  node2_x: number,
  node2_y: number
): number {
  const x = node2_x - node1_x;
  const y = node2_y - node1_y;
  const atan = Math.atan2(y, x); // 使用 atan2 方法来获取角度
  let angle = Math.round((atan * 180) / Math.PI); // 将弧度转换为角度

  if (angle < 0) {
    angle += 360;
  }

  return angle > 0 ? 360 - angle : angle; // 修正角度
}

/**
 * 获取交易级别，根据指定的金额范围和分段数
 * @param amount - 当前交易金额
 * @param minAmount - 最小交易金额
 * @param maxAmount - 最大交易金额
 * @param levels - 分段数，默认为 5
 * @returns 返回对应的交易级别（1, 1.5, 2, 2.5, 3）或 null
 */
export function getTransactionLevel(
  amount: number,
  minAmount: number,
  maxAmount: number,
  levels: number = 5
): number | null {
  if (minAmount >= maxAmount || levels <= 0) {
    throw new Error('Invalid minAmount, maxAmount, or levels.');
  }

  const range = (maxAmount - minAmount) / levels;

  // 计算交易级别
  for (let i = 0; i < levels; i++) {
    const lowerBound = minAmount + i * range;
    const upperBound = minAmount + (i + 1) * range;

    if (amount >= lowerBound && amount < upperBound) {
      return 1 + i * 0.5; // 交易级别从 1 开始，每个级别增加 0.5
    }
  }

  // 检查是否在最大级别的范围内
  if (amount >= minAmount + (levels - 1) * range && amount <= maxAmount) {
    return 1 + (levels - 1) * 0.5; // 返回最大级别
  }

  return null; // 如果不在范围内，返回 null
}
