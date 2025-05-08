import CardItem, {CardItemProps} from "./CardItem";

interface CardListProps{
    items: CardItemProps[];
}

export default function List( {items} : CardListProps) {
    return(
        <div className="flex items-center justify-center">
            <div className="grid grid-cols-3 gap-1 mx-2">
            {items.map((item, idx) => (
                <CardItem key={idx} {...item}/>
            ))}
        </div>
        </div>
        
    );
}