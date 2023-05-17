export default function parseYoloV4Annotation(
  annotation: string,
): [string, number[][]] {
  const [imageName, ...labels] = annotation.split(' ');
  const numbericLabels = labels.map((l) => l.split(',').map(Number.parseFloat));
  return [imageName, numbericLabels];
}
