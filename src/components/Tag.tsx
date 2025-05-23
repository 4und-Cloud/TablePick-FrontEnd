interface TagProps {
    text: string;
}

export default function Tag({text}: TagProps) {
    return (
        <span
            className="whitespace-nowrap text-base font-semibold bg-main shadow-xl text-white px-4 py-4 inline-block text-center rounded-20">
            {text}
       </span>
    )
}
