interface CircleBtnProps{
    image: string;
    bgColor? : string;
    onClick? : () => void;
};

export default function CircleBtn( {image, bgColor='bg-white', onClick} : CircleBtnProps){
    return(
        <button onClick={onClick} className={`w-[40px] h-[40px] rounded-full border-main border-2 flex items-center justify-center ${bgColor}`}>
            <img src={image} className='w-[25px] h-[25px]' />
        </button>
    )
}