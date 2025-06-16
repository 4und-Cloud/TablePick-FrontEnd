// kakao-maps.d.ts
declare namespace kakao {
  namespace maps {
    function load(callback: () => void): void;
    // LatLng 클래스 타입 정의
    class LatLng {
      constructor(lat: number, lng: number);
      getLat(): number;
      getLng(): number;
    }

    // Map 클래스 타입 정의
    class Map {
      constructor(container: HTMLElement, options: { center: LatLng; level: number });
      setCenter(latlng: LatLng): void;
      relayout(): void;
    }

    // Marker 클래스 타입 정의
    class Marker {
      constructor(options: { position: LatLng; map?: Map });
      setMap(map: Map | null): void;
    }
  }

  declare global {
    interface Window {
      kakao: {
        maps: {
          load: (callback: () => void) => void;
          LatLng: typeof kakao.maps.LatLng;
          Map: typeof kakao.maps.Map;
          Marker: typeof kakao.maps.Marker;
          InfoWindow: typeof kakao.maps.InfoWindow;
        };
      };
    }
  }
}
