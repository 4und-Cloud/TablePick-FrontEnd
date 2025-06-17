import CardItem from '@/@shared/components/CardItem';
import { CardItemProps } from '../types/cardItemsType';

interface CardListProps {
    items: CardItemProps[];
  onDelete?: (id: number) => void;
}

export default function List( {items,  onDelete } : CardListProps) {
  return(
    <div className="flex flex-col justify-start min-h-[1200px] py-4">
      <div className="grid grid-cols-3 gap-4 mx-auto max-w-[1200px]">
        {items.map((item) => (
          <CardItem key={item.id} {...item} onDelete={onDelete}/>
        ))}
      </div>
    </div>    
  );
}
