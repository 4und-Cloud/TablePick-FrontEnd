import location from '@/@shared/images/location.png';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CardItemProps } from '@/@shared/types/cardItemsType';

const CardItem = ({
  id,
  linkTo,
  image,
  containerStyle,
  imageStyle,
  restaurantNameStyle,
  restaurantName,
  description,
  tags = [],
  reservationInfo,
  button,
  buttonPosition,
  onDelete,
}: CardItemProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (linkTo) {
      navigate(linkTo);
    }
  };

  const handleDeleteClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (onDelete) {
      onDelete(id);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`relative flex flex-col p-3 mx-2 my-2 overflow-hidden ${containerStyle ?? 'border w-[370px] rounded-xl shadow-xl min-h-[335px] bg-card'}`}
    >
      {image && (
        <img
          src={image}
          alt={restaurantName}
          className={`w-full h-[200px] rounded-md object-cover mb-2 ${imageStyle}`}
          loading="lazy"
        />
      )}

      <div className="flex flex-col justify-between w-full overflow-hidden">
        <div className="flex flex-col overflow-hidden w-full">
          <div className="flex flex-col justify-between w-full">
            <div className="flex flex-row items-center gap-2">
              <img src={location} width={16} height={16} alt="location" />
              <span className={`text-lg font-bold w-full truncate ${restaurantNameStyle}`}>
                {restaurantName}
              </span>
            </div>

            {description && (
              <span className="text-sm text-gray-600 w-full mt-[2px] truncate">
                {description}
              </span>
            )}
          </div>

          {reservationInfo && (
            <div className="text-main text-medium font-bold">
              {reservationInfo}
            </div>
          )}

          {tags.length > 0 && (
            <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-hide w-full">
              {tags.map((tag, i) => (
                <span
                  key={i}
                  className="bg-main text-white font-semibold text-sm px-3 py-1 rounded-full whitespace-nowrap"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {onDelete && (
          <button
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 text-xs font-bold hover:bg-red-600"
            onClick={handleDeleteClick}
          >
            삭제
          </button>
        )}

        {button && buttonPosition === 'bottom' && (
          <div className="absolute bottom-2">{button}</div>
        )}
      </div>
    </div>
  );
};

export default React.memo(CardItem);
