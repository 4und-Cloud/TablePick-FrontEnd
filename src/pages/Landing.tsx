import TextBtn from "../components/Button/TextBtn";
import place from '@/assets/images/place.png';
import location from '@/assets/images/location.png';
import chqkq from '@/assets/images/chqkq.jpg';


const dummy = [
    {restaurantName: '센시티브서울' ,image: place},
    {restaurantName: '센시티브서울' ,image: chqkq},
    {restaurantName: '센시티브서울' ,image: place},  
    {restaurantName: '센시티브서울' ,image: place},    
  
]

export default function Landing(){
    
    return(
        <div className="mt-[80px] p-3">
            <div className="mb-10 mt-8">
                <div className="flex flex-row justify-between m-4">
                    <p className="font-bold text-2xl text-gray-500 ml-2">고객님이 좋아할 매장</p>
                    <TextBtn fontSize="text-xl" text="식당 더 보기 ->" />
                </div>
                <div className="flex flex-col items-center justify-between">
                    <div className="flex flex-row justify-between gap-10">
                        {dummy.map((item, idx) => (
                            <div key={idx}>
                                <img src={item.image} className="w-[250px] h-[250px] rounded-20"/>
                                <div className="mt-1 flex flex-row gap-2 items-center">
                                    <img src={location} className="w-[18px] h-[18px]"  />
                                    <span className="text-lg font-semibold">{item.restaurantName}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div>
                <div className="flex flex-row justify-between m-4 mb-2">
                    <p className="font-bold text-2xl text-gray-500 ml-2">고객님이 좋아할 게시글</p>
                    <TextBtn fontSize="text-xl" text="게시글 더 보기 ->" />
                </div>
                <div className="flex flex-col items-center justify-between">
                    <div className="flex flex-row justify-between gap-10 mt-2">
                        {dummy.map((item, idx) => (
                            <div key={idx}>
                                <img src={item.image} className="w-[250px] h-[250px] rounded-20"/>
                                <div className="mt-1 flex flex-row gap-2 items-center">
                                    <img src={location} className="w-[18px] h-[18px]"  />
                                    <span className="text-lg font-semibold">{item.restaurantName}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            
        </div>
    )
}