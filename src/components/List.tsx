import CardItem, {CardItemProps} from "./CardItem";

interface CardListProps{
    items: CardItemProps[];
  linkTo?: string;
  onDelete?: (id: number) => void;
}

export default function List( {items,  onDelete ,linkTo} : CardListProps) {
  return(
    <div className="flex items-center justify-center">
      <div className="grid grid-cols-3 gap-1 mx-2">
        {items.map((item, idx) => (
          <CardItem key={idx} {...item} linkTo={linkTo} onDelete={onDelete}/>
        ))}
      </div>
    </div>    
  );
}