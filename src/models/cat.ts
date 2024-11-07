interface Breed {
  name: string
  origin: string
  description: string
  life_span: string
}

export interface Cat {
  id: string
  url: string
  width: number
  height: 709
  breeds?: Breed[]
}
