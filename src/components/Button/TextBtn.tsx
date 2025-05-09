import clsx from "clsx";

interface TextBtnProps{
    text : string; 
    fontSize? : string; // 텍스트 크기
    fontWeight? : string; // 기본 텍스트 굵기
    hoverFontWeight?: string; // hover 시 텍스트 굵기 
    hoverTextColor? : string; // hover 시 텍스트 색
    underlineOnHover? : boolean; // hover 시 밑줄
    onClick? : () => void;
}

export default function TextBtn({
    text,
    fontWeight = 'font-medium',
    hoverFontWeight = 'hover:font-bold',
    hoverTextColor = 'hover:text-accent',
    fontSize = 'text-sm',
    onClick
}: TextBtnProps) {
    return(
        <button 
            onClick={onClick}
            className={clsx(
                'border-none p-0 text-[16px] text-main hover:underline',
                fontWeight,
                hoverFontWeight,
                hoverTextColor,
                fontSize,
            )}
            >{text}</button>
    )

}