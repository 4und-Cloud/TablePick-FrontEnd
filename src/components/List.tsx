import CardItem, {CardItemProps} from "./CardItem";

interface CardListProps {
    items: CardItemProps[];
  onDelete?: (id: number) => void;
}

export default function List( {items,  onDelete } : CardListProps) {
  return(
    <div className="flex items-center justify-center">
      <div className="grid grid-cols-3 gap-1 mx-2">
        {items.map((item) => (
          <CardItem key={item.id} {...item} onDelete={onDelete}/>
        ))}
      </div>
    </div>    
  );
}
