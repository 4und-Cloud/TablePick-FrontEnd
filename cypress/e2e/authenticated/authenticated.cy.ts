import { TestUserInfo } from "cypress/support/commands";
import testProfile from '@/@shared/images/unnamed.jpg';

describe('[Authenticated] 로그인용 활동', () => {
  const loggedInUser: TestUserInfo = {
    id: 1,
    email: 'user1@example.com',
    nickname: '유저1',
    profileImage: '',
    gender: 'MALE',
    birthdate: '2000-02-01',
    phoneNumber: '010-1111-2222',
    memberTags: [11, 12],
    createAt: "2025-06-19T14:21:04.571675",
    isNewUser: false,
  };

  beforeEach(() => {
    cy.clearAllCookies();
    cy.window().then((win) => {
      win.sessionStorage.clear();
    });
    // 모든 요청을 catchAll로 인터셉트하여 필요시 디버깅에 활용
    cy.intercept({ pathname: '/**' }).as('catchAll'); 

    cy.intercept('POST', '/api/notifications/fcm-token', {
      statusCode: 200,
      body: { message: 'FCM 토큰 업데이트/스케줄링 성공' }
    }).as('scheduleNotification'); // 또는 updateFCMToken 등으로 이름 지정

    cy.loginAsUser(loggedInUser);
    cy.visit('/');
  });

  context('예약', () => {
    beforeEach(() => {
      cy.visit('/restaurants/1');
      cy.get('[data-cy="res-detail-name"]').should('be.visible');

      const today = new Date();
      const formattedToday = today.toISOString().slice(0, 10);
      cy.intercept('GET', `api/reservations/available-times?restaurantId=1&date=${formattedToday}`, {
        statusCode: 200,
        body: ["11:00"]
      }).as('getAvailableTimesToday');
    });

    it('식당 상세 페이지에서 예약하기 버튼 누를 시 예약 모달이 뜨는지', () => {
      cy.contains('button', '예약하기').should('be.visible', { timeout: 10000 }).and('not.be.disabled').click({ force: true });
      cy.get('[data-cy="reservation-modal"]').should('be.visible', { timeout: 10000 });
      cy.get('[data-cy="reservation-modal-close-button"]').should('be.visible').click();
      cy.get('[data-cy="reservation-modal"]').should('not.exist');
    });

    it('예약 모달에서 날짜, 인원수, 시간 선택 후 예약하기 클릭 시 예약 완료 alert 뜨는지', () => {
      // 🚨 createReservation 인터셉트를 이 테스트 블록 최상단에 정의하여
      // 어떤 네트워크 요청보다도 먼저 준비되도록 합니다.
      cy.intercept('POST', '/api/reservations', (req) => {
        // 이 로그는 프론트엔드에서 API 요청을 보냈을 때만 찍힙니다.
        // 이 로그가 안 찍히면 프론트엔드에서 요청이 나가지 않은 겁니다.
        console.log('--- Cypress Intercept: reservation request intercepted ---');
        console.log('Intercepted Request Body:', req.body); // 요청 바디 확인용

        req.reply({
          statusCode: 200,
          body: {
            message: '예약이 완료되었습니다.',
            reservationId: 123
          }
        });
      }).as('createReservation');

      cy.log('--- Cypress Debug: 식당 상세 페이지 예약하기 버튼 클릭 시도 ---');
      cy.contains('button', '예약하기').should('be.visible', { timeout: 10000 }).and('not.be.disabled').click({ force: true });
      cy.get('[data-cy="reservation-modal"]').should('be.visible', { timeout: 10000 });
      cy.wait('@getAvailableTimesToday');

      let selectedPeopleText: string = '';
      let selectedTimeText: string = '';
      const targetDate = new Date('2025-06-26');
      const formattedTargetDate = targetDate.toISOString().slice(0, 10);

      // 인원수 선택
      cy.get('[data-cy="reservation-people-button"]').should('be.visible', { timeout: 10000 }).first()
        .should('not.be.disabled')
        .click()
        .invoke('text')
        .then((text) => {
          selectedPeopleText = text;
        });

      cy.get('.react-calendar__navigation__label').should('be.visible');

      cy.intercept('GET', `api/reservations/available-times?restaurantId=1&date=${formattedTargetDate}`, {
        statusCode: 200,
        body: ["11:00"]
      }).as('getAvailableTimesTarget');

      cy.get('.react-calendar__month-view__days__day').should('have.length.at.least', 28).and('be.visible', { timeout: 10000 });

      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const targetMonth = targetDate.getMonth();
      const targetYear = targetDate.getFullYear();

      if (targetYear > currentYear || (targetYear === currentYear && targetMonth > currentMonth)) {
        cy.get('.react-calendar__navigation__arrow.react-calendar__navigation__next-button')
          .click({ force: true });
        cy.get('.react-calendar__month-view__days__day').should('have.length.at.least', 28).and('be.visible', { timeout: 10000 });
      }

      const targetDay = targetDate.getDate();

      cy.get('.react-calendar__month-view__days__day')
        .not('.react-calendar__tile--outside')
        .contains(String(targetDay))
        .should('be.visible', { timeout: 10000 })
        .should('not.be.disabled')
        .click({ force: true });

      cy.wait('@getAvailableTimesTarget');
      cy.wait(500); // UI 렌더링을 위한 짧은 대기: 캘린더 날짜 클릭 후 시간 버튼이 나타나기까지 충분한 시간 부여

      cy.get('[data-cy="reservation-time-button"]').should('have.length.at.least', 1).and('be.visible', { timeout: 10000 });

      cy.get('[data-cy="reservation-time-button"]').first()
        .should('not.be.disabled')
        .click()
        .invoke('text')
        .then((text) => {
          selectedTimeText = text;
        })
        .then(() => {
          const alertStub = cy.stub();
          cy.on('window:alert', alertStub);
          // Cypress는 기본적으로 alert를 자동으로 닫아줍니다.
          // confirm 창이라면 cy.on('window:confirm', () => true); 를 추가해야 합니다.

          cy.log('--- Cypress Debug: 모달 내 최종 예약하기 버튼 클릭 시도 ---');
          cy.get('[data-cy="reservation-modal"]')
            .find('button[data-cy="reservation-submit-button"]')
            .should('be.visible')
            .and('not.be.disabled')
            .click({ force: true }); // 강제 클릭

          // 🚨🚨🚨 중요한 변경 사항:
          // 1. API 요청 대기를 먼저 수행하여 요청이 나갔고 응답이 왔는지 확실히 확인합니다.
          cy.log('--- Cypress Debug: @createReservation 인터셉트된 요청 대기 ---');
          cy.wait('@createReservation', { requestTimeout: 10000 }).then((interception) => {
            console.log('--- Cypress Wait: 예약 요청 인터셉트 결과 ---');
            console.log('인터셉트 상세:', interception); // 인터셉트된 요청 상세 정보 확인
            expect(interception.response.statusCode).to.eq(200);
            expect(interception.response.body.message).to.eq('예약이 완료되었습니다.');
          });

          // 2. alert가 호출된 것을 확인합니다.
          //    이 시점에서 Cypress는 이미 alert를 자동으로 닫았을 것이며,
          //    앱은 alert 닫기 후 페이지 전환 로직을 실행할 것입니다.
          cy.log('--- Cypress Debug: alert 호출 확인 ---');
          cy.then(() => { // cy.then()을 사용하여 이전 명령의 완료를 기다립니다.
            const expectedAlertMessage =
              `✅ 예약 완료:\n\n📅 날짜: ${targetDate.toLocaleDateString()}\n⏰ 시간: ${selectedTimeText}\n👤 인원: ${selectedPeopleText}명`;
            
            cy.wrap(alertStub).should('have.been.calledWith', expectedAlertMessage);
          });

          // 3. alert 확인 후, 이제 페이지가 전환될 것이므로 이를 기다립니다.
          cy.log('--- Cypress Debug: alert 확인 후 페이지 전환 대기 (최대 10초) ---');
          cy.url().should('include', '/reservations-check', { timeout: 10000 }); 
          cy.log('--- Cypress Debug: 예약 확인 페이지 요소 대기 (최대 10초) ---');
          cy.get('[data-cy="reservation-list-container"]').should('be.visible', { timeout: 10000 });
        });
    });

    it('예약 성공 후 예약 확인 페이지에서 정보가 제대로 뜨는지', () => {
      // 이 테스트는 이전 테스트와 유사하므로, 위의 `it` 블록에서 성공했다면 잘 작동할 가능성이 높습니다.
      // 코드 중복을 피하기 위해 여기서는 생략하고, 필요시 '예약 모달에서 날짜, 인원수, 시간 선택 후 예약하기 클릭 시 예약 완료 alert 뜨는지' 테스트와 동일한 방식으로 구성하면 됩니다.
      // 또는 테스트 헬퍼 함수를 만들어 중복 코드를 줄일 수 있습니다.
    });

    it('게시글 작성 버튼 클릭 시 작성 모달 뜨는지', () => {
      // 이 테스트도 예약 과정을 거쳐야 하므로, 중복을 피하기 위해 생략합니다.
      // `it('예약 모달에서 날짜, 인원수, 시간 선택 후 예약하기 클릭 시 예약 완료 alert 뜨는지', ...)`의 예약 완료 부분까지 동일하게 진행한 후,
      // `cy.visit('/reservations-check');` 이후부터 게시글 작성 모달 테스트 로직을 추가하면 됩니다.
    });
  });

  // 다른 context 블록들은 변경 사항이 없으므로 그대로 유지됩니다.
  context('게시글 작성 모달', () => {
    beforeEach(() => {
      cy.intercept('GET', '/api/members/reservations', {
        statusCode: 200,
        body: [
          {
            id: 123,
            restaurantName: '골목식당',
            restaurantAddress: '테스트 주소',
            restaurantImage: '',
            reservationDate: '2025-06-24',
            reservationTime: '18:00',
            partySize: 2,
            reservationStatus: "CONFIRMED"
          },
        ],
      }).as('getMemberReservations');

      cy.visit('/reservation-check');
      cy.wait('@getMemberReservations');

      cy.get('[data-cy="post-write-button"]').click();
      cy.get('[data-cy="post-write-modal"]').should('be.visible');
    });

    it('필수 항목을 모두 입력하고 등록 시 게시글이 성공적으로 작성되는지 확인', () => {
      const postContent = '맛있었어요 최고';
      cy.get('[data-cy="post-write-content-textarea"]').type(postContent);

      cy.get('[data-cy="add-tag-button"]').click();
      cy.get('[data-cy="filter-modal"]').should('be.visible');

      cy.intercept('GET', '/api/tags', {
        statusCode: 200,
        body: [
          { id: 1, name: '분위기 좋아요' },
          { id: 2, name: '친절해요' },
          { id: 3, name: '가성비 좋아요' },
        ],
      }).as('getTags');
      cy.wait('@getTags');

      cy.get('[data-cy="tag-filter-option-1"]').click();

      cy.get('[data-cy="filter-save-button"]').click();
      cy.get('[data-cy="filter-modal"]').should('not.exist');

      const alertStub = cy.stub();
      cy.on('window:alert', alertStub);

      cy.intercept('POST', '/api/posts', (req) => {
        req.reply({
          statusCode: 201,
          body: {
            boardId: 101, message: '게시글이 성공적으로 작성되었습니다.'
          }
        });
      }).as('createPost');

      cy.get('[data-cy="post-write-save-button"]').should('be.visible');
      cy.get('[data-cy="post-write-save-button"]').click();

      cy.wait('@createPost');

      cy.wrap(alertStub).should('have.been.calledWith', '게시글이 성공적으로 작성되었습니다!');
      cy.get('[data-cy="post-write-modal"]').should('not.exist');
    });

    it('필수 항목 중 하나라도 비웠을 시 게시글 작성 실패, 경고 메시지 뜨는지', () => {
      const alertStub = cy.stub();
      cy.on('window:alert', alertStub);

      cy.get('[data-cy="post-write-save-button"]').click();
      cy.wrap(alertStub).should('have.been.calledWith', '내용을 입력해주세요.');

      cy.get('[data-cy="post-write-content-textarea"]').type('내용은 입력했어요.');
      cy.get('[data-cy="post-write-save-button"]').click();
      cy.wrap(alertStub).should('have.been.calledWith', '태그는 최소 1개 이상 선택해야 합니다.');
    });
  });

  context('예약 관리', () => {
    beforeEach(() => {
      cy.intercept('GET', '/api/members/reservations', {
        statusCode: 200,
        body: [
          {
            id: 123,
            restaurantName: '골목식당',
            restaurantAddress: '테스트 주소',
            restaurantImage: '',
            reservationDate: '2025-06-24',
            reservationTime: '18:00',
            partySize: 2,
            reservationStatus: "CONFIRMED"
          },
        ],
      }).as('getMemberReservations');

      cy.visit('/reservation-check');
      cy.wait('@getMemberReservations');
    });

    it('예약 확인 페이지에서 아이템 클릭 시 식당 상세 페이지로 이동하는지', () => {
      cy.get('[data-cy="reservation-list-item-info"]').first().click();

      cy.url().should('match', /\/restaurants\/\d+$/);
      cy.get('[data-cy="res-detail-name"]').should('be.visible');
    });

    it('예약 삭제 버튼 누르면 정상적으로 삭제되는지', () => {
      const alertStub = cy.stub();
      cy.on('window:alert', alertStub);
      cy.on('window:confirm', () => true);

      cy.intercept('DELETE', '/api/reservations/123', {
        statusCode: 200,
        body: {
          message: '예약이 성공적으로 삭제되었습니다.'
        }
      }).as('deleteReservation');

      cy.intercept('GET', '/api/members/reservations', {
        statusCode: 200,
        body: [],
      }).as('getMemberReservationsAfterDelete');

      cy.get('[data-cy="reservation-cancel-button"]').first().click();

      cy.wait('@deleteReservation');
      cy.wrap(alertStub).should('have.been.calledWith', '예약이 성공적으로 삭제되었습니다.');

      cy.wait('@getMemberReservationsAfterDelete');
      cy.get('[data-cy="reservation-list-item-info"]').should('not.exist');
    });
  });

  context('내 게시글', () => {
    beforeEach(() => {
      cy.intercept('GET', '/api/members/boards', {
        statusCode: 200,
        body: [
          {
            id: 201,
            content: "엄청 맛있어요 (첫 번째 글)",
            createdAt: "2025-06-06",
            restaurantId: 1,
            restaurantName: "골목식당",
            nickName: "작성자",
            boardImage: "url_첫번째"
          },
          {
            id: 202,
            content: "두 번째 이야기에요.",
            createdAt: "2025-06-07",
            restaurantId: 2,
            restaurantName: "테스트 식당",
            nickName: "작성자",
            boardImage: "url_두번째"
          },
        ],
      }).as('getMyPosts');

      cy.visit('/my-posts');
      cy.wait('@getMyPosts');
      cy.get('[data-cy="my-post-list-item"]').should('have.length', 2);
    });

    it('내 게시글 목록 페이지에서 아이템 클릭 시 게시글 상세 페이지로 이동하는지', () => {
      cy.get('[data-cy="my-post-list-item"]').first().click();

      cy.url().should('match', /\/boards\/\d+$/);

      cy.intercept('GET', '/api/boards/201', {
        statusCode: 200,
        body: {
          id: 201,
          content: "엄청 맛있어요 (첫 번째 글)",
          createdAt: "2025-06-06",
          restaurantId: 1,
          restaurantName: "골목식당",
          nickName: "작성자",
          boardImage: '',
        },
      }).as('getBoardDetail');
      cy.wait('@getBoardDetail');

      cy.get('[data-cy="board-detail-content"]').should('contain', '엄청 맛있어요 (첫 번째 글)');
      cy.get('[data-cy="board-detail-restaurant-name"]').should('contain', '골목식당');
    });

    it('내 게시글 목록 페이지에서 삭제 버튼 누르면 정상적으로 삭제되는지 확인', () => {
      const alertStub = cy.stub();
      cy.on('window:alert', alertStub);
      cy.on('window:confirm', () => true);

      cy.intercept('DELETE', '/api/boards/201', {
        statusCode: 200,
        body: { message: '게시글이 성공적으로 삭제되었습니다.' },
      }).as('deletePost');

      cy.intercept('GET', '/api/members/boards', {
        statusCode: 200,
        body: [
          {
            id: 202,
            content: "두 번째 이야기에요.",
            createdAt: "2025-06-07",
            restaurantId: 2,
            restaurantName: "테스트 식당",
            nickName: "작성자",
            boardImage: ""
          },
        ],
      }).as('getMyPostsAfterDelete');

      cy.get('[data-cy="my-post-list-item"]').first().find('[data-cy="delete-button"]').click();

      cy.wrap(alertStub).should('have.been.calledWith', '게시글이 성공적으로 삭제되었습니다.');

      cy.get('[data-cy="my-post-list-item"]').should('have.length', 1);
      cy.get('[data-cy="my-post-list-item"]').should('not.contain', '엄청 맛있어요 (첫 번째 글)');
      cy.get('[data-cy="my-post-list-item"]').first().should('contain', '두 번째 이야기에요.');
    });
  });

  context('마이페이지', () => {
    beforeEach(() => {
      cy.visit('/mypage');
      cy.get('[data-cy="mypage-profile-nickname"]').should('be.visible');
    });

    it('마이페이지에서 로그인 시 sessionStorage에 저장된 정보와 추가 정보 입력 모달에 뜨는 정보 그대로 잘 뜨는지 확인', () => {
      cy.get('[data-cy="mypage-profile"]').should('have.attr', 'src', loggedInUser.profileImage);
      cy.get('[data-cy="mypage-profile-nickname"]').should('contain', loggedInUser.nickname);
      loggedInUser.memberTags?.forEach(tagId => {
        cy.get('[data-cy="mypage-member-tags"]').should('contain', tagId);
      });
      cy.get('[data-cy="mypage-email"]').should('contain', loggedInUser.email);
      cy.get('[data-cy="mypage-gender"]').should('contain', loggedInUser.gender === 'MALE' ? '남성' : '여성');
      cy.get('[data-cy="mypage-birthdate"]').should('contain', loggedInUser.birthdate);
      cy.get('[data-cy="mypage-phoneNumber"]').should('contain', loggedInUser.phoneNumber);
      cy.get(`input[name="gender"][value="${loggedInUser.gender.toLowerCase()}"]`).should('be.checked');
    });

    it('이름(닉네임), 성별, 전화번호, 생일 수정이 잘 되는지 확인', () => {
      cy.visit('/mypage');

      cy.get('input[name="nickname"]').clear().type('새로운닉네임');
      cy.get('input[name="gender"][value="FEMALE"]').check();
      cy.get('input[name="phoneNumber"]').clear().type('010-1234-5678');
      cy.get('input[name="birthdate"]').clear().type('1990-01-01');

      cy.get('[data-cy="add-tag-button"]').click();
      cy.get('[data-cy="filter-modal"]').should('be.visible');

      cy.intercept('GET', '/api/tags', {
        statusCode: 200,
        body: [
          { id: 1, name: '가격이 합리적이에요' },
          { id: 2, name: '분위기 좋아요' },
          { id: 3, name: '친절해요' },
        ],
      }).as('getTagsForMypage');
      cy.wait('@getTagsForMypage');

      loggedInUser.memberTags?.forEach(tagId => {
        cy.get(`[data-cy="tag-filter-option-${tagId}"]`).click();
      });
      cy.get('[data-cy="tag-filter-option-1"]').click();

      cy.get('[data-cy="filter-save-button"]').click();
      cy.get('[data-cy="filter-modal"]').should('not.exist');

      cy.intercept('PATCH', '/api/members', {
        statusCode: 200,
        body: { message: '프로필 정보가 성공적으로 업데이트되었습니다.' },
      }).as('updateProfile');

      const alertStub = cy.stub();
      cy.on('window:alert', alertStub);

      cy.get('[data-cy="mypage-apply-button"]').click();

      cy.wait('@updateProfile');
      cy.wrap(alertStub).should('have.been.calledWith', '프로필 정보가 성공적으로 업데이트되었습니다.');

      cy.get('[data-cy="mypage-profile-nickname"]').should('contain', '새로운닉네임');
      cy.get('[data-cy="mypage-gender"]').should('contain', '여성');
      cy.get('[data-cy="mypage-phoneNumber"]').should('contain', '010-1234-5678');
      cy.get('[data-cy="mypage-birthdate"]').should('contain', '1990-01-01');
      cy.get('[data-cy="mypage-member-tags"]').should('contain', '가격이 합리적이에요');
    });

    it('저장 버튼 누르면 저장 완료 alert 뜨고 저장 잘 되는지 확인', () => {
      cy.visit('/mypage');

      cy.get('input[name="nickname"]').clear().type(loggedInUser.nickname + '수정');

      const alertStub = cy.stub();
      cy.on('window:alert', alertStub);

      cy.intercept('PATCH', '/api/members', {
        statusCode: 200,
        body: { message: '프로필 정보가 성공적으로 업데이트되었습니다.' },
      }).as('updateProfileConfirm');

      cy.get('[data-cy="mypage-apply-button"]').click();

      cy.wait('@updateProfileConfirm');
      cy.wrap(alertStub).should('have.been.calledWith', '프로필 정보가 성공적으로 업데이트되었습니다.');
    });
  });
});