import clsx from 'clsx';

interface RoundedBtnProps{
    text? : string; // login | logout
    borderColor? : string; // border 색
    bgColor? : string; // 배경 색
    textColor? : string; // 텍스트 색
    width? : string; // 넓이
    height? :string; // 높이
    hoverColor? : string; // hover 시 배경 색
    hoverBorderColor? : string; // hover 시 border 색
    hoverTextColor? : string; // hover 시 텍스트 색
    onClick?: () => void;
    disabled?: () => void;
}

export default function RoundedBtn({
    text,
    bgColor = 'bg-white',
    borderColor = 'border-transparent',
    textColor = 'text-black',
    width = 'w-[100px]',
    height = 'h-[40px]',
    hoverColor = 'hover:bg-main',
    hoverBorderColor = 'hover:border-white',
    hoverTextColor = 'hover:text-white',
    onClick,
} : RoundedBtnProps) {
    return (
        <button onClick={onClick} 
            
            className={clsx(
                'shadow-xl rounded-[16px] border-[2px]', 
                height,
                bgColor, 
                borderColor,
                textColor, 
                width, 
                hoverColor, 
                hoverBorderColor, 
                hoverTextColor)}>
            {text}
        </button>
    )
}