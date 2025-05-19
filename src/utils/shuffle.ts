/**
 * 지역성을 유지하는 소극적 셔플 알고리즘
 * 가까운 항목들끼리만 교환하여 전체적인 순서가 크게 변하지 않습니다.
 * @param array 섞을 배열
 * @param shuffleIntensity 섞는 강도 (0: 원래 순서 유지, 1: 최대 지역 교환)
 * @returns 섞인 새 배열
 */
export function shuffleArray<T>(array: T[], shuffleIntensity = 0.2): T[] {
  const result = [...array];
  const n = result.length;

  if (n <= 1) return result;

  // 최대 이동 거리 계산 (작은 값일수록 더 지역적)
  // shuffleIntensity가 1일 때 최대 이동 거리는 배열 길이의 약 20%
  const maxDistance = Math.max(1, Math.ceil(n * 0.2 * shuffleIntensity));

  // 교환 횟수 결정 (배열 길이에 비례)
  // 한번의 셔플에 n*shuffleIntensity번 교환
  const swapCount = Math.floor(n * shuffleIntensity);

  // 지역적 교환 수행
  for (let i = 0; i < swapCount; i++) {
    // 먼저 무작위 위치 선택
    const a = Math.floor(Math.random() * n);

    // 해당 위치에서 ±maxDistance 내에서 다른 위치 선택
    const offset = Math.floor(Math.random() * (maxDistance * 2 + 1)) - maxDistance;
    let b = a + offset;

    // 배열 범위를 벗어나지 않도록 조정
    if (b < 0) b = 0;
    if (b >= n) b = n - 1;

    // 같은 위치가 아니라면 교환
    if (a !== b) {
      [result[a], result[b]] = [result[b], result[a]];
    }
  }

  return result;
}
