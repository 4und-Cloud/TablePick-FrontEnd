/// <reference types="cypress" />

export interface TestUserInfo {
  id: number;
  email: string;
  nickname: string;
  profileImage: string;
  gender?: string;
  birthdate?: string;
  phoneNumber?: string;
  memberTags?: number[];
  memberTagNames?: string[];
  createAt?: string;
  isNewUser?: boolean;
}

declare global {
  namespace Cypress {
    interface Chainable {
      loginAsUser(userPayload: TestUserInfo): Chainable<void>;
      closeModal(modalSelector?: string): Chainable<void>;
    }
  }
}

Cypress.Commands.add('loginAsUser', (userPayload: TestUserInfo) => {

  // sessionStorage 및 localStorage 초기화
  cy.window().then((win) => {
    win.sessionStorage.clear();
    win.localStorage.clear();
    cy.log('🧪 [Cypress] sessionStorage 및 localStorage 초기화 완료');
  });

  // 페이지 방문 및 강제 로그인 상태 설정
  cy.visit('/', {
    onBeforeLoad(win) {
      console.log('🧪 [onBeforeLoad] sessionStorage 설정:', JSON.stringify(userPayload));
      win.sessionStorage.setItem('userInfo', JSON.stringify(userPayload));
      win.sessionStorage.setItem('fcm_token', 'mock-fcm-token-for-test-env');
    },
  });

  // sessionStorage 확인 (visit 후 DOM이 로드된 후에 확인)
  cy.window().its('sessionStorage.userInfo').should('exist').then((userInfo) => {
    const parsed = JSON.parse(userInfo);
    cy.log('🟢 [Cypress] sessionStorage userInfo 검증:', parsed);
    expect(parsed.id).to.equal(userPayload.id);
    expect(parsed.email).to.equal(userPayload.email);
  });

  cy.window().then((win) => {
    cy.log('🧪 [Cypress] auth:sync 이벤트 디스패치');
    win.dispatchEvent(new Event('auth:sync'));
  });

  cy.get('[data-cy="header-guest"]', { timeout: 15000 }).should('not.exist'); 
  cy.log('🟢 [Cypress] UnAuthHeader (header-guest)가 성공적으로 사라졌습니다.');

  cy.get('[data-cy="header-authenticated"]', { timeout: 10000 }).should('be.visible');
  cy.log('🟢 [Cypress] AuthHeader (header-authenticated)가 성공적으로 렌더링되었습니다.');

  cy.get('[data-cy="header-logout-button"]', { timeout: 5000 }).should('be.visible');

  cy.get('[data-cy="header-reservation-check-button"]', { timeout: 5000 }).should('be.visible');
  cy.get('[data-cy="header-my-post-button"]', { timeout: 5000 }).should('be.visible');
  cy.get('[data-cy="header-my-page-button"]', { timeout: 5000 }).should('be.visible');
  cy.get('[data-cy="header-notification-list-button"]', { timeout: 5000 }).should('be.visible');

  cy.log('🟢 [Cypress] 모든 인증된 헤더 요소 검증 성공');
});

Cypress.Commands.add('closeModal', (modalSelector: string = '.modal-wrapper') => {
  cy.get(modalSelector).should('be.visible');
  cy.get(`${modalSelector} [data-cy="modal-close-button"]`).click();
  cy.get(modalSelector).should('not.exist');
});