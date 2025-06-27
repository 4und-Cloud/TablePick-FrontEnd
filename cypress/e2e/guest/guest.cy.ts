import { TestUserInfo } from "cypress/support/commands";
import testProfile from '@/@shared/images/unnamed.jpg';

describe('[Guest] 비로그인용 활동 시나리오', () => {
  beforeEach(() => {
    cy.clearAllCookies();
    cy.window().then((win) => {
      win.sessionStorage.clear();
    });
    cy.intercept({ pathname: '/**' }).as('catchAll');

    cy.visit('/');
  });

  context('랜딩 페이지', () => {
    it('랜딩 페이지 접속 시 비로그인용 헤더 정상적 표시되는지', () => {
      cy.get('[data-cy="header-guest"]').should('be.visible'); // 비로그인용 헤더 보이는지
      cy.get('[data-cy="header-login-button"]', { timeout: 10000 }).should('be.visible');
      cy.get('[data-cy="header-logout-button"]').should('not.exist'); // 로그아웃 버튼 안 보이는지

      cy.get('[data-cy="header-authenticated"]').should('not.exist'); // 로그인용 헤더 없는지
      cy.get('[data-cy="header-my-page-button"]').should('not.exist'); // 마이페이지 버튼없는지
      cy.get('[data-cy="header-reservation-check-button"]').should('not.exist'); // 예약 확인 버튼 없는지
      cy.get('[data-cy="header-my-post-button"]').should('not.exist'); // 내 게시글 버튼 없는지
      cy.get('[data-cy="header-notification-list-button"]').should('not.exist'); // 알림 버튼 없는지 (오타 수정)
    });

    it('랜딩 페이지 접속 시 콘텐츠 4개씩 보이는지', () => {
      // 🚨 수정된 부분: intercept를 visit 이전에 설정하고, 실제 데이터 배열을 body로 제공
      cy.intercept('GET', '/api/restaurants/all', {
        statusCode: 200,
        body: [ // 실제 4개 이상의 아이템을 렌더링할 수 있도록 더미 데이터 제공
          { id: 1, name: '레스토랑 1', imageUrl: 'https://placehold.co/150x100/EFEFEF/text- Restaurant%201', category: '한식', address: '서울' },
          { id: 2, name: '레스토랑 2', imageUrl: 'https://placehold.co/150x100/EFEFEF/text- Restaurant%202', category: '양식', address: '부산' },
          { id: 3, name: '레스토랑 3', imageUrl: 'https://placehold.co/150x100/EFEFEF/text- Restaurant%203', category: '일식', address: '대구' },
          { id: 4, name: '레스토랑 4', imageUrl: 'https://placehold.co/150x100/EFEFEF/text- Restaurant%204', category: '중식', address: '인천' },
          { id: 5, name: '레스토랑 5', imageUrl: 'https://placehold.co/150x100/EFEFEF/text- Restaurant%205', category: '기타', address: '광주' },
        ],
      }).as('landingRestaurants');

      cy.intercept('GET', '/api/boards/list', {
        statusCode: 200,
        body: [ // 실제 4개 이상의 아이템을 렌더링할 수 있도록 더미 데이터 제공
          { id: 1, content: '게시글 1', imageUrl: 'https://placehold.co/150x100/EFEFEF/text- Post%201', restaurantName: '식당A' },
          { id: 2, content: '게시글 2', imageUrl: 'https://placehold.co/150x100/EFEFEF/text- Post%202', restaurantName: '식당B' },
          { id: 3, content: '게시글 3', imageUrl: 'https://placehold.co/150x100/EFEFEF/text- Post%203', restaurantName: '식당C' },
          { id: 4, content: '게시글 4', imageUrl: 'https://placehold.co/150x100/EFEFEF/text- Post%204', restaurantName: '식당D' },
          { id: 5, content: '게시글 5', imageUrl: 'https://placehold.co/150x100/EFEFEF/text- Post%205', restaurantName: '식당E' },
        ],
      }).as('landingPosts');

      cy.visit('/'); // intercepts가 visit 이전에 활성화됩니다.

      cy.wait('@landingRestaurants');
      cy.wait('@landingPosts');

      cy.get('[data-cy="landing-restaurants-item"]').should('have.length.at.least', 4);
      cy.get('[data-cy="landing-posts-item"]').should('have.length.at.least', 4);
    });

    it('비로그인용 헤더의 버튼들 올바르게 작동하는지', () => {
      cy.get('[data-cy="header-restaurants-list-link"]').click();
      cy.url().should('include', '/restaurants'); // 식당 페이지 이동했는지 url 확인
      cy.go('back'); // 뒤로가기

      cy.get('[data-cy="header-posts-list-link"]').click();
      cy.url().should('include', '/posts'); // 게시글 페이지 이동했는지 url 확인
      cy.go('back'); // 뒤로가기
    });

    it('랜딩페이지에서 식당 아이템 클릭 시 식당 상세 페이지로 이동하는지', () => {
      // 랜딩 페이지 식당 목록이 로드될 때까지 기다립니다.
      cy.intercept('GET', '/api/restaurants/all', {
        statusCode: 200,
        body: [ // 실제 4개 이상의 아이템을 렌더링할 수 있도록 더미 데이터 제공
          { id: 1, name: '레스토랑 1', imageUrl: 'https://placehold.co/150x100/EFEFEF/text- Restaurant%201', category: '한식', address: '서울' },
          { id: 2, name: '레스토랑 2', imageUrl: 'https://placehold.co/150x100/EFEFEF/text- Restaurant%202', category: '양식', address: '부산' },
          { id: 3, name: '레스토랑 3', imageUrl: 'https://placehold.co/150x100/EFEFEF/text- Restaurant%203', category: '일식', address: '대구' },
          { id: 4, name: '레스토랑 4', imageUrl: 'https://placehold.co/150x100/EFEFEF/text- Restaurant%204', category: '중식', address: '인천' },
          { id: 5, name: '레스토랑 5', imageUrl: 'https://placehold.co/150x100/EFEFEF/text- Restaurant%205', category: '기타', address: '광주' },
        ],
      }).as('getRestaurantsForLandingClick');
      
      cy.visit('/');
      cy.wait('@getRestaurantsForLandingClick'); // 식당 목록 API 호출 완료 대기

      cy.get('[data-cy="landing-res-card-item"]').first().click(); // 첫번째 식당 아이템 클릭
      cy.url().should('match', /\/restaurants\/\d+$/);
      cy.get('[data-cy="restaurant-detail-info"]').should('be.visible');
    });

    it('랜딩페이지에서 게시글 아이템 클릭 시 게시글 상세 페이지로 이동하는지', () => {
      // 랜딩 페이지 게시글 목록이 로드될 때까지 기다립니다.
      cy.intercept('GET', '/api/boards/list', {
        statusCode: 200,
        body: [ // 실제 4개 이상의 아이템을 렌더링할 수 있도록 더미 데이터 제공
          { id: 1, content: '게시글 1', imageUrl: 'https://placehold.co/150x100/EFEFEF/text- Post%201', restaurantName: '식당A' },
          { id: 2, content: '게시글 2', imageUrl: 'https://placehold.co/150x100/EFEFEF/text- Post%202', restaurantName: '식당B' },
          { id: 3, content: '게시글 3', imageUrl: 'https://placehold.co/150x100/EFEFEF/text- Post%203', restaurantName: '식당C' },
          { id: 4, content: '게시글 4', imageUrl: 'https://placehold.co/150x100/EFEFEF/text- Post%204', restaurantName: '식당D' },
          { id: 5, content: '게시글 5', imageUrl: 'https://placehold.co/150x100/EFEFEF/text- Post%205', restaurantName: '식당E' },
        ],
      }).as('getPostsForLandingClick');

      cy.visit('/');
      cy.wait('@getPostsForLandingClick'); // 게시글 목록 API 호출 완료 대기

      cy.get('[data-cy="landing-post-card-item"]').first().click(); // 첫번째 게시글 아이템 클릭
      cy.url().should('match', /\/posts\/\d+$/);
      cy.get('[data-cy="post-detail-info"]').should('be.visible');
    });
  });

  context('게시글 리스트 및 상세 페이지', () => {
    beforeEach(() => {
      // 게시글 리스트 페이지 접속 전, API 인터셉트 설정
      cy.intercept('GET', '/api/boards/list', {
        statusCode: 200,
        body: [
          { id: 101, content: "테스트 게시글 1", restaurantName: "테스트 식당 A", imageUrl: "https://placehold.co/150x100/EFEFEF/text- Post%20101", createdAt: "2023-01-01" },
          { id: 102, content: "테스트 게시글 2", restaurantName: "테스트 식당 B", imageUrl: "https://placehold.co/150x100/EFEFEF/text- Post%20102", createdAt: "2023-01-02" },
          { id: 103, content: "테스트 게시글 3", restaurantName: "테스트 식당 C", imageUrl: "https://placehold.co/150x100/EFEFEF/text- Post%20103", createdAt: "2023-01-03" },
          { id: 104, content: "테스트 게시글 4", restaurantName: "테스트 식당 D", imageUrl: "https://placehold.co/150x100/EFEFEF/text- Post%20104", createdAt: "2023-01-04" },
          { id: 105, content: "테스트 게시글 5", restaurantName: "테스트 식당 E", imageUrl: "https://placehold.co/150x100/EFEFEF/text- Post%20105", createdAt: "2023-01-05" },
        ],
      }).as('getBoardList');

      cy.visit('/posts');
      cy.wait('@getBoardList'); // 게시글 리스트 API 호출 완료 대기
    });

    it('게시글 리스트 페이지 잘 뜨는지', () => {
      cy.get('[data-cy="post-list-container"]').should('be.visible');
      cy.get('[data-cy="post-list-item"]').should('have.length.at.least', 1); // 첫 번째 게시글 아이템이 보이는지
    });

    it('무한 스크롤 잘 동작하는지', () => {
      // 초기 아이템 수 확인
      cy.get('[data-cy="post-list-item"]').its('length').then((initialCount) => {
        // 무한 스크롤로 추가 아이템을 로드하기 위한 mocking (예시: 다음 5개)
        cy.intercept('GET', '/api/boards/list?**', (req) => { // 쿼리 파라미터가 있을 수 있으므로 와일드카드 사용
          req.reply({
            statusCode: 200,
            body: [
              { id: 106, content: "추가 게시글 6", restaurantName: "식당F", imageUrl: "https://placehold.co/150x100/EFEFEF/text- Post%20106", createdAt: "2023-01-06" },
              { id: 107, content: "추가 게시글 7", restaurantName: "식당G", imageUrl: "https://placehold.co/150x100/EFEFEF/text- Post%20107", createdAt: "2023-01-07" },
              { id: 108, content: "추가 게시글 8", restaurantName: "식당H", imageUrl: "https://placehold.co/150x100/EFEFEF/text- Post%20108", createdAt: "2023-01-08" },
              { id: 109, content: "추가 게시글 9", restaurantName: "식당I", imageUrl: "https://placehold.co/150x100/EFEFEF/text- Post%20109", createdAt: "2023-01-09" },
              { id: 110, content: "추가 게시글 10", restaurantName: "식당J", imageUrl: "https://placehold.co/150x100/EFEFEF/text- Post%20110", createdAt: "2023-01-10" },
            ],
          });
        }).as('getMoreBoardList');

        cy.scrollTo('bottom'); // 하단으로 스크롤

        cy.wait('@getMoreBoardList'); // 추가 게시글 API 호출 완료 대기
        cy.wait(500); // UI 렌더링을 위한 짧은 대기

        cy.get('[data-cy="post-list-item"]').its('length').should('be.gt', initialCount); // 아이템 개수 증가했는지
      });
    });


    it('게시글 아이템 클릭 시 상세 페이지 이동하고 정보 잘 뜨는지', () => {
      // 게시글 상세 정보를 위한 인터셉트 (첫 번째 게시글 ID 101 가정)
      cy.intercept('GET', '/api/boards/101', {
        statusCode: 200,
        body: {
          id: 101,
          content: "테스트 게시글 1 내용입니다. 상세 페이지에서 잘 보여야 합니다.",
          restaurantName: "테스트 식당 A",
          imageUrl: "https://placehold.co/300x200/EFEFEF/text- Detail%20Post%201",
          createdAt: "2023-01-01",
          author: "테스트유저",
          // 필요한 다른 상세 정보 추가
        },
      }).as('getBoardDetail');

      cy.get('[data-cy="post-list-item"]').first().click();

      cy.url().should('match', /\/posts\/\d+$/); // 상세 페이지로 잘 이동했는지
      cy.wait('@getBoardDetail'); // 상세 정보 API 호출 완료 대기

      cy.get('[data-cy="board-detail-restaurant-name"]').should('be.visible').and('contain', '테스트 식당 A'); // 식당명 보이는지
      cy.get('[data-cy="board-detail-content"]').should('be.visible').and('contain', '테스트 게시글 1 내용입니다.'); // 내용 보이는지
    });
  });

  context('식당 리스트 및 상세 페이지', () => {
    beforeEach(() => {
      // 식당 리스트 페이지 접속 전, API 인터셉트 설정
      cy.intercept('GET', '/api/restaurants/all', {
        statusCode: 200,
        body: [
          { id: 1, name: '식당 이름 1', address: '서울시 강남구', category: '한식', imageUrl: 'https://placehold.co/150x100/EFEFEF/text- Restaurant%201', rating: 4.5 },
          { id: 2, name: '식당 이름 2', address: '서울시 마포구', category: '양식', imageUrl: 'https://placehold.co/150x100/EFEFEF/text- Restaurant%202', rating: 3.8 },
          { id: 3, name: '식당 이름 3', address: '부산시 해운대구', category: '일식', imageUrl: 'https://placehold.co/150x100/EFEFEF/text- Restaurant%203', rating: 4.0 },
          { id: 4, name: '식당 이름 4', address: '대구시 수성구', category: '중식', imageUrl: 'https://placehold.co/150x100/EFEFEF/text- Restaurant%204', rating: 4.2 },
          { id: 5, name: '식당 이름 5', address: '인천시 연수구', category: '퓨전', imageUrl: 'https://placehold.co/150x100/EFEFEF/text- Restaurant%205', rating: 3.5 },
        ],
      }).as('getRestaurantList');

      cy.visit('/restaurants');
      cy.wait('@getRestaurantList'); // 식당 리스트 API 호출 완료 대기
    });

    it('식당 리스트 페이지 잘 뜨는지', () => {
      cy.get('[data-cy="restaurant-list-container"]').should('be.visible');
      cy.get('[data-cy="restaurant-list-item"]').should('have.length.at.least', 1); // 첫 번째 식당 아이템이 보이는지
    });

    it('무한 스크롤 잘 동작하는지', () => {
      cy.get('[data-cy="restaurant-list-item"]').its('length').then((initialCount) => {
        // 무한 스크롤로 추가 아이템을 로드하기 위한 mocking (예시: 다음 5개)
        cy.intercept('GET', '/api/restaurants/all?**', (req) => { // 쿼리 파라미터가 있을 수 있으므로 와일드카드 사용
          req.reply({
            statusCode: 200,
            body: [
              { id: 6, name: '식당 이름 6', address: '대전시 유성구', category: '한식', imageUrl: 'https://placehold.co/150x100/EFEFEF/text- Restaurant%206', rating: 4.1 },
              { id: 7, name: '식당 이름 7', address: '광주시 서구', category: '일식', imageUrl: 'https://placehold.co/150x100/EFEFEF/text- Restaurant%207', rating: 3.9 },
              { id: 8, name: '식당 이름 8', address: '울산시 남구', category: '중식', imageUrl: 'https://placehold.co/150x100/EFEFEF/text- Restaurant%208', rating: 4.3 },
              { id: 9, name: '식당 이름 9', address: '세종시', category: '퓨전', imageUrl: 'https://placehold.co/150x100/EFEFEF/text- Restaurant%209', rating: 3.7 },
              { id: 10, name: '식당 이름 10', address: '강원도 춘천시', category: '한식', imageUrl: 'https://placehold.co/150x100/EFEFEF/text- Restaurant%2010', rating: 4.6 },
            ],
          });
        }).as('getMoreRestaurantList');

        cy.scrollTo('bottom'); // 하단으로 스크롤
        cy.wait('@getMoreRestaurantList'); // 추가 식당 API 호출 완료 대기
        cy.wait(500); // UI 렌더링을 위한 짧은 대기

        cy.get('[data-cy="restaurant-list-item"]').its('length').should('be.gt', initialCount); // 아이템 개수 증가했는지
      });
    });

    it('식당 아이템 클릭 시 상세 페이지 이동하고 정보 잘 뜨는지', () => {
      // 식당 상세 정보를 위한 인터셉트 (첫 번째 식당 ID 1 가정)
      cy.intercept('GET', '/api/restaurants/1', {
        statusCode: 200,
        body: {
          id: 1,
          name: '식당 이름 1',
          category: '한식',
          address: '서울시 강남구',
          imageUrl: 'https://placehold.co/300x200/EFEFEF/text- Detail%20Restaurant%201',
          openingHours: '매일 10:00 - 22:00',
          contact: '02-1234-5678',
          description: '맛있는 한식을 제공하는 식당입니다. 예약 환영!',
          tags: [{id:1, name:'분위기좋음'}, {id:2, name:'친절함'}],
          // 필요한 다른 상세 정보 추가
        },
      }).as('getRestaurantDetail');

      cy.get('[data-cy="restaurant-list-item"]').first().click();

      cy.url().should('match', /\/restaurants\/\d+$/); // 상세 페이지로 잘 이동했는지
      cy.wait('@getRestaurantDetail'); // 상세 정보 API 호출 완료 대기

      cy.get('[data-cy="res-detail-category"]').should('be.visible').and('contain', '한식'); // 식당 카테고리 보이는지
      cy.get('[data-cy="res-detail-name"]').should('be.visible').and('contain', '식당 이름 1'); // 식당명 보이는지
      cy.get('[data-cy="res-detail-address"]').should('be.visible').and('contain', '서울시 강남구'); // 식당 주소 보이는지
      cy.get('[data-cy="res-detail-tag-list"]').should('be.visible').and('contain', '분위기좋음'); // 식당 태그 보이는지
      cy.get('[data-cy="res-detail-map"]').should('be.visible'); // 식당 지도 보이는지
      cy.get('[data-cy="reservation-button"]').should('be.visible'); // 예약하기 버튼 보이는지
    });

    it('예약하기 버튼 누를 시 로그인 모달이 뜨는지', () => {
      // 식당 상세 페이지 데이터 인터셉트 (ID 1 식당)
      cy.intercept('GET', '/api/restaurants/1', {
        statusCode: 200,
        body: {
          id: 1,
          name: '식당 이름 1',
          category: '한식',
          address: '서울시 강남구',
          imageUrl: 'https://placehold.co/300x200/EFEFEF/text- Detail%20Restaurant%201',
          openingHours: '매일 10:00 - 22:00',
          contact: '02-1234-5678',
          description: '맛있는 한식을 제공하는 식당입니다. 예약 환영!',
          tags: [{id:1, name:'분위기좋음'}, {id:2, name:'친절함'}],
        },
      }).as('getRestaurantDetailForReservation');

      cy.visit('/restaurants/1');
      cy.wait('@getRestaurantDetailForReservation'); // 식당 상세 API 호출 완료 대기

      cy.url().should('match', '/restaurants/1');

      cy.get('[data-cy="reservation-button"]').should('be.visible');
      cy.get('[data-cy="reservation-button"]').click();
      cy.get('[data-cy="login-modal"]').should('be.visible'); // 로그인 모달이 보이는지 확인
      cy.get('[data-cy="login-modal-close-button"]').click();
      cy.get('[data-cy="login-modal"]').should('not.exist');
    });

    it('식당 상세 페이지에서 게시글 보기 클릭 시 해당 식당에 관한 게시글 목록이 뜨는지', () => {
      // 식당 상세 페이지 데이터 인터셉트 (ID 1 식당)
      cy.intercept('GET', '/api/restaurants/1', {
        statusCode: 200,
        body: {
          id: 1,
          name: '식당 이름 1',
          category: '한식',
          address: '서울시 강남구',
          imageUrl: 'https://placehold.co/300x200/EFEFEF/text- Detail%20Restaurant%201',
          openingHours: '매일 10:00 - 22:00',
          contact: '02-1234-5678',
          description: '맛있는 한식을 제공하는 식당입니다. 예약 환영!',
          tags: [{id:1, name:'분위기좋음'}, {id:2, name:'친절함'}],
        },
      }).as('getRestaurantDetailForPosts');
      
      // 해당 식당의 게시글 목록을 위한 인터셉트 (restaurantId=1)
      cy.intercept('GET', '/api/boards/list?restaurantId=1', {
        statusCode: 200,
        body: [
          { id: 201, content: "이 식당 게시글 1", restaurantName: "식당 이름 1", imageUrl: "https://placehold.co/150x100/EFEFEF/text- Post%20201", createdAt: "2023-02-01" },
          { id: 202, content: "이 식당 게시글 2", restaurantName: "식당 이름 1", imageUrl: "https://placehold.co/150x100/EFEFEF/text- Post%20202", createdAt: "2023-02-02" },
        ],
      }).as('getRestaurantPosts');

      cy.visit('/restaurants/1');
      cy.wait('@getRestaurantDetailForPosts'); // 식당 상세 API 호출 완료 대기

      cy.get('[data-cy="res-post-view-button"]').should('be.visible').click(); // 게시글 보기 버튼 클릭

      cy.url().should('match', /\/posts\?restaurantId=\d+$/); // URL이 올바르게 변경되었는지 확인
      cy.wait('@getRestaurantPosts'); // 해당 식당의 게시글 목록 API 호출 완료 대기
      cy.get('[data-cy="post-list-item"]').should('have.length.at.least', 1); // 게시글 아이템이 보이는지 확인
    });
  });
  
})