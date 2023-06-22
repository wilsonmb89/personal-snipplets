export interface ItemCardModel {
  title: string;
  description: string;
  image: 'card-green.png' | 'card-unicef.png';
  backgroundColor: 'green' | 'unicef';
  callback: () => void;

}


