export interface AddMemberInfoProps {
  gender: 'MALE' | 'FEMALE' | '';
  birthdate: string;
  phoneNumber: string;
  memberTags: number[];
}

export interface MemberFormData {
  nickname: string;
  gender: 'MALE' | 'FEMALE' | '';  // ''는 선택 안 했을 때
  birthdate: string;
  phoneNumber: string;
  profileImage: string;
  memberTags: number[];  // 백엔드가 id만 받으면 number[]만 써도 됨
}