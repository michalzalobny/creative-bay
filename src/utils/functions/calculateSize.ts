interface CalculateSize {
  wrapperWidth: number;
  maxItems: number;
  padding: number;
  isPaddingRelative: boolean;
}

interface CalculateSizeReturn {
  elWidth: number;
  elPadding: number;
}

//If padding is relative, then final padding is percent of containers width,
//otherwise its a pixel value provided
export const calculateSize = (props: CalculateSize): CalculateSizeReturn => {
  const { wrapperWidth, maxItems, padding, isPaddingRelative } = props;
  let elPadding = padding;
  if (isPaddingRelative) elPadding = padding * wrapperWidth;
  const paddingsSum = elPadding * (maxItems - 1);
  const elWidth = (wrapperWidth - paddingsSum) / maxItems;
  return { elWidth, elPadding };
};
