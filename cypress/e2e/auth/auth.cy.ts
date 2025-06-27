import testProfile from '@/@shared/images/unnamed.jpg';

import { UserInfo } from "@/app/provider/AuthContext";

import { TestUserInfo } from 'cypress/support/commands';

describe('로그인/로그아웃 ', () => {
  // 테스트용 유효한 사용자 정보
  const validUser: TestUserInfo = {
    id: 1,
    email: 'user1@example.com',
    nickname: '유저1',
    profileImage: '',
    gender: 'MALE',
    birthdate: '2000-02-01',
    phoneNumber: '010-1111-2222',
    memberTags: [57],
    memberTagNames: ['가격이 합리적이에요'],
    createAt: "2025-06-19T14:21:04.571675",
    isNewUser: false,
  };

  // 테스트용 신규 사용자 정보
  const newUser: UserInfo = {
    id: 2,
    email: 'user2@example.com',
    nickname: '유저2',
    profileImage: '',
    gender: '',
    birthdate: '2000-02-03',
    phoneNumber: '010-2222-2222',
    memberTags: [6, 20, 68],
    createAt: "2025-06-20T16:05:04.571675",
    isNewUser: true,
  };

  // 테스트용 신규 사용자 정보
  const newUser2: UserInfo = {
    id: 2,
    email: 'user2@example.com',
    nickname: '유저2',
    profileImage: '',
    gender: 'FEMALE',
    birthdate: '2000-02-03',
    phoneNumber: '010-2222-2222',
    memberTags: [6, 20, 68],
    createAt: "2025-06-20T16:05:04.571675",
    isNewUser: true,
  };
  
  // 각 테스트 케이스 실행 전 브라우저 상태 초기화 => 클린업
  beforeEach(() => {
    cy.clearCookies(); // 모든 쿠키 제거
    cy.window().then((win) => {
      win.sessionStorage.clear(); // 세션 스토리지 초기화
    });
    cy.intercept({ pathname: '/**' }).as('catchAll'); // 모든 api 인터셉트 초기화
  });

  
  // 로그인 시나리오 - 유효한 사용자
  context('로그인 - 유효한 정보', () => {
    it('유효한 정보로 로그인 성공 시 홈으로 이동하고 로그인용 헤더로 변경되는지', () => {
      cy.loginAsUser(validUser); 
      cy.url().should('eq', Cypress.config().baseUrl + '/'); // 홈으로 이동했는지
    });

    it('로그인 API 호출 후 사용자 정보 세션스토리지에 userInfo로 담아 확인', () => {
      cy.loginAsUser(validUser);

      cy.window().then((win) => {
        const userInfo = JSON.parse(win.sessionStorage.getItem('userInfo') || '{}');
        expect(userInfo).to.deep.equal(validUser);
      });
    });

    it('로그인 성공 후 마이페이지로 이동해서 모든 정보가 정확한지 확인', () => {
      cy.loginAsUser(validUser);
      cy.get('[data-cy="header-my-page-button"]').click(); // 마이페이지로 이동

      cy.url().should('include', '/mypage'); // url에 /mypage 포함되어 있는지

      // mypage에 유효한 사용자에 있는 거랑 일치하는지
      cy.get('[data-cy="mypage-profile"]').should('have.attr', 'src', validUser.profileImage); // 프로필 이미지
      cy.get('[data-cy="mypage-profile-nickname"]').should('have.value', validUser.nickname);
      validUser.memberTagNames?.forEach(tagName => { 
        cy.get('[data-cy="mypage-member-tags"]')
          .contains(tagName) 
          .should('be.visible');
      });
      cy.get('[data-cy="mypage-email"]').should('have.value', validUser.email); // 이메일
      cy.get('[data-cy="mypage-gender"]').should('contain', '남성'); // 성별
      cy.get('[data-cy="mypage-birthdate"]').should('have.value', validUser.birthdate); // 생일
      cy.get('[data-cy="mypage-phoneNumber"]').should('have.value', validUser.phoneNumber); // 전화번호

      cy.get('[data-cy="mypage-cancel-button"]').should('be.visible'); // 취소 버튼 있는지
      cy.get('[data-cy="mypage-apply-button"]').should('be.visible'); // 저장 버튼 있는지
    });
  });

  context('최초 로그인 시나리오', () => {
    const expectedAlertMessage = '모든 폼을 다 채워주세요! 전화번호는 010-1234-5678 형식이어야 합니다.';

    beforeEach(() => {
      cy.intercept('GET', '/api/tags', {
        statusCode: 200,
        body: [
          { id: 57, name: '가격이 합리적이에요' },
          { id: 6, name: '가성비가 좋아요' },
          { id: 20, name: '건강한 맛이에요' },
          { id: 68, name: '고급스러워요' },
        ],
      }).as('getTags');
    });

    it('초기 성별 정보가 없는 상태에서 적용하기 클릭 시 alert 메시지 확인', () => {
      cy.loginAsUser(newUser);
      cy.get('[data-cy="add-info-modal"]').should('be.visible');
      cy.wait('@getTags');

      const alertStub = cy.stub();
      cy.on('window:alert', alertStub);

      cy.get('[data-cy="add-info-save-button"]').click();

      cy.wrap(alertStub).should('have.been.calledWith', expectedAlertMessage);
      cy.get('[data-cy="add-info-modal"]').should('be.visible');
    });

    it('추가 정보 입력 모달에서 각 필수 필드를 지우고 저장 시 동일한 alert 메시지 확인', () => {
      cy.loginAsUser(newUser2);
      cy.get('[data-cy="add-info-modal"]').should('be.visible');
      cy.wait('@getTags');

      const alertStub = cy.stub();
      cy.on('window:alert', alertStub);

      const requiredFields = [
        { name: '생년월일', dataCy: 'add-info-birth-input', type: 'date', initialValue: newUser.birthdate },
        { name: '전화번호', dataCy: 'add-info-phone-input', type: 'text', initialValue: newUser.phoneNumber },
        { name: '멤버 태그', dataCy: 'tag-select-button', type: 'tags', initialValue: newUser.memberTags }
      ];
      
      requiredFields.forEach((field) => {
        switch (field.type) {
          case 'date':
          case 'text':
            cy.get(`[data-cy="${field.dataCy}"]`).clear();
            break;
          case 'tags':
            cy.get('[data-cy="tag-select-button"]').click();
            cy.get('[data-cy="filter-modal"]').should('be.visible');

            cy.get('[data-cy="tag-filter-option-6"]', { timeout: 10000 }).should('be.visible');

            if (field.initialValue && field.initialValue.length > 0) {
              (field.initialValue as number[]).forEach(tagName => {
                cy.get(`[data-cy="tag-filter-option-${tagName}"]`).click();
              });
            }
            cy.get('[data-cy="filter-save-button"]').click();
            cy.get('[data-cy="filter-modal"]').should('not.exist');
            break;
        }
        cy.get('[data-cy="add-info-save-button"]').click();
        cy.wrap(alertStub).should('have.been.calledWith', expectedAlertMessage);
        cy.get('[data-cy="add-info-modal"]').should('be.visible');

        switch (field.type) {
          case 'date':
          case 'text':
            cy.get(`[data-cy="${field.dataCy}"]`).type(field.initialValue as string || '');
            break;
          case 'tags':
            if (field.initialValue && field.initialValue.length > 0) {
              cy.get('[data-cy="tag-select-button"]').click();
              cy.get('[data-cy="filter-modal"]').should('be.visible');

              cy.get('[data-cy="tag-filter-option-6"]', { timeout: 10000 }).should('be.visible');

              (field.initialValue as number[]).forEach(tagName => {
                cy.get(`[data-cy="tag-filter-option-${tagName}"]`).click();
              });
              cy.get('[data-cy="filter-save-button"]').click();
              cy.get('[data-cy="filter-modal"]').should('not.exist');
            }
            break;
        }
        alertStub.resetHistory();
      });
    });

    it('모든 필수 정보를 입력하면 성공적으로 저장되고 홈으로 이동하는지 확인', () => {
      cy.loginAsUser(newUser2);
      cy.get('[data-cy="add-info-modal"]').should('be.visible');

      cy.intercept('POST', '/api/members', {
        statusCode: 200,
        body: { message: '정보가 성공적으로 저장되었습니다.' }
      }).as('saveAddInfo');

      cy.get('[data-cy="add-info-save-button"]').click();
      cy.wait('@saveAddInfo');

      cy.get('[data-cy="add-info-modal"]').should('not.exist');
      cy.url().should('eq', Cypress.config().baseUrl + '/');
    });
  });

  context('로그아웃', () => {
    // 로그인 상태에서 시작
    beforeEach(() => {
      cy.loginAsUser(validUser); // 유효한 사용자로 로그인 상태 만들기
      cy.get('[data-cy="header-logout-button"]').should('be.visible'); // 로그아웃 버튼 있는지
      // cy.get('[data-cy="header-login-button"]').should('not.exist'); // 비로그인 헤더에 login 버튼이 있다면 검증
    });

    it('로그아웃 버튼 누르면 userInfo와 fcm토큰 사라지는지', () => {
      cy.intercept('POST', '/api/members/logout', {
        statusCode: 200,
        body: { message: '로그아웃 성공' },
      }).as('logoutApiCall');

      cy.get('[data-cy="header-logout-button"]').click(); // 로그아웃 버튼 클릭
      cy.wait('@logoutApiCall'); // 로그아웃 api 호출 완료까지 기다림

      // 세션 스토리지 검증
      cy.window().then((win) => {
        expect(win.sessionStorage.getItem('userInfo')).to.be.null;
        expect(win.sessionStorage.getItem('fcm_token')).to.be.null;
      });

      // 비로그인용 헤더 전환 확인 및 홈 이동 확인
      cy.url().should('eq', Cypress.config().baseUrl + '/'); // 홈으로 이동했는지
      // 로그인용 헤더 사라졌는지 확인 (header-authenticated가 사라졌는지)
      cy.get('[data-cy="header-authenticated"]', { timeout: 5000 }).should('not.exist'); 
      cy.get('[data-cy="header-logout-button"]', { timeout: 5000 }).should('not.exist'); // 로그아웃 버튼 없어졌는지
      // 만약 비로그인 헤더에 로그인 버튼이 있다면, 나타나는지 확인
      // cy.get('[data-cy="header-login-button"]', { timeout: 5000 }).should('be.visible'); 
    });

    it('로그아웃 버튼 클릭 시 쿠키 모두 사라지는지', () => {
      cy.intercept('POST', '/api/members/logout', (req) => {
        req.reply({
          statusCode: 200,
          body: { message: '로그아웃 성공' },
          headers: {
            'Set-Cookie': [
              'access_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly', // 만료일을 과거로 설정
              'refresh_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly',
              'JSESSIONID=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly'
            ].join(','),
          },
        });
      }).as('logoutApiCall');

      cy.get('[data-cy="header-logout-button"]').click();
      cy.wait('@logoutApiCall');

      // 쿠키 존재하는지 확인
      cy.getCookies().should('be.empty');
    });
  });
});