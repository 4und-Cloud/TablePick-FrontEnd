import api from "@/@shared/api/api";
import { AddMemberInfoProps, MemberFormData } from "../types/memberType";

export const fetchAddMemberInfo = async (data: AddMemberInfoProps) => {
    const response = await api.post('/api/members', data);
    return response.data;
};

export const fetchUpdatedMemberInfo = async (formData: MemberFormData) => {
    const requestBody = {
    nickname: formData.nickname,
    gender: formData.gender?.toUpperCase() || '',
    birthdate: formData.birthdate,
    phoneNumber: formData.phoneNumber,
    profileImage: formData.profileImage,
    memberTags: formData.memberTags,
  };
    const response = await api.patch('/api/members', requestBody);
    return response.data;
}

export const fetchLogout = async () => {
    await api.post('/api/members/logout');
}