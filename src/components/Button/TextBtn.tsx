import clsx from "clsx";

interface TextBtnProps{
    text : string; 
    hoverFontWeight?: string; // hover 시 텍스트 굵기 
    hoverTextColor? : string; // hover 시 텍스트 색
    underlineOnHover? : boolean; // hover 시 밑줄
    onClick? : () => void;
}

export default function TextBtn({
    text,
    hoverFontWeight = 'hover:font-bold',
    hoverTextColor = 'hover:text-text-accent',
    onClick
}: TextBtnProps) {
    return(
        <button 
            onClick={onClick}
            className={clsx(
                'border-none p-0 text-[16px] font-medium text-main hover:underline',
                hoverFontWeight,
                hoverTextColor,
            )}
            >{text}</button>
    )

}