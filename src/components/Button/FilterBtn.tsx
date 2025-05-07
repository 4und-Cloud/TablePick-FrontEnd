import filter from '@/assets/images/filter.png'

export default function FilterBtn(){
    return(
        <div className='w-[40px] h-[40px] rounded-full border-main border-2 flex items-center justify-center'>
            <img src={filter} className='w-[30px] h-[30px] ' />
        </div>
    )
}