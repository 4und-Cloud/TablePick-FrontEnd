interface CheckboxProps {
    tags: string[];
    selected: string[];
    onToggle: (tag: string) => void;
};

export default function Checkbox({tags, selected, onToggle} : CheckboxProps){
    return(
        <div className="flex flex-wrap gap-3">
      {tags.map((tag) => (
        <label key={tag} className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={selected.includes(tag)}
            onChange={() => onToggle(tag)}
          />
          <span>{tag}</span>
        </label>
      ))}
    </div>
    )
}