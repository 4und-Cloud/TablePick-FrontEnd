/// <reference types="cypress" />

// TestUserInfo 인터페이스
export interface TestUserInfo {
  id: number;
  email: string;
  nickname: string;
  profileImage: string;
  gender?: string;
  birthdate?: string;
  phoneNumber?: string;
  memberTags?: number[];
  createAt?: string;
  isNewUser?: boolean;
}

declare global {
  namespace Cypress {
    interface Chainable {
      loginAsUser(userPayload: TestUserInfo, password?: string): Chainable<void>;
      closeModal(modalSelector?: string): Chainable<void>;
    }
  }
}

// 로그인 헬퍼
Cypress.Commands.add('loginAsUser', (userPayload: TestUserInfo, password?: string) => {
	cy.intercept('POST', '**/api/auth/login', (req) => {
		req.reply({
			statusCode: 200,
			body: {
				message: '로그인 성공',
				user: userPayload,
				accessToken: 'mock-access-token',
				refreshToken: 'mock-refresh-token',
			},
			headers: {
				'Set-Cookie': [
					'accessToken=mock-access-token-from-cookie; Path=/; HttpOnly;',
					'refreshToken=mock-refresh-token-from-cookie; Path=/; HttpOnly;',
					'JsessionId=mock-jsession-id-from-cookie; Path=/; HttpOnly;',
				],
			},
		});
	}).as('loginApiCall');

	cy.request('POST', '/api/auth/login', {
		email: userPayload.email,
		password: password || 'testpassword123',
	}).then((response) => {
		const receivedUser = response.body.user;
		cy.window().then((win) => {
			win.sessionStorage.setItem('userInfo', JSON.stringify(receivedUser || userPayload));
			win.sessionStorage.setItem('fcm_token', 'mock-fcm-token-for-test-env');
		});
	});

	cy.visit('/');
	cy.get('[data-cy="header-my-page-button"]').should('be.visible');
	cy.get('[data-cy="header-profile-image"]').should('contain', userPayload.profileImage);
	cy.get('[data-cy="header-logout-button"]').should('be.visible');
});

// 모달 닫기 헬퍼
Cypress.Commands.add('closeModal', (modalSelector: string = '.modal-wrapper') => {
	cy.get(modalSelector).should('be.visible');
	cy.get(`${modalSelector} [data-cy="modal-close-button"]`).click();
	cy.get(modalSelector).should('not.exist');
});

