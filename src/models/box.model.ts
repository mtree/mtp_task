export enum BoxType {
  Red = 'red',
  Green = 'green',
  Blue = 'blue'
}

// TODO: Generic type???
export interface Box {
  id: string;
  type: BoxType;
  name: string;
  // TODO: Dynamic fields
  fields: { [key: string]: any };
}
