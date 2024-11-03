declare enum Category {
  HATS = 1,
  SPACE = 2,
  SUNGLASSES = 4,
  BOXES = 5,
  TIES = 7,
  SINKS = 14,
  CLOTHES = 15,
}

export function getCategoryFromString(category: string): Category | undefined {
  const categoryName = category.toUpperCase()
  switch (categoryName) {
    case "HATS":
      return Category.HATS
    case "SPACE":
      return Category.SPACE
    case "SUNGLASSES":
      return Category.SUNGLASSES
    case "BOXES":
      return Category.BOXES
    case "TIES":
      return Category.TIES
    case "SINKS":
      return Category.SINKS
    case "CLOTHES":
      return Category.CLOTHES
    default:
      return undefined
  }
}
