# Velvet Thorn

가시 궁정의 음모를 퍼즐로 헤쳐 나가는 다크 판타지 매치3 RPG (Android).

- `game/`: 웹 게임 전체 (`index.html`, `style.css`, `js/`, `assets/`). 그림, 음악, 효과음, 컷신은 모두 코드로 그리고 합성합니다. 게임 설명은 `game/README.md`.
- `scripts/build-www.js`: 게임 파일을 `www/`로 복사합니다. 릴리스 빌드에서는 `ads.json`의 실제 광고 ID를 넣습니다.
- `android/`: Capacitor가 만든 안드로이드 프로젝트 (세로 고정).
- `resources/`: 아이콘, 스플래시 원본. 바꾸면 `npm run assets`.
- `.github/workflows/android.yml`: main에 푸시하면 테스트용 APK와 구글 플레이용 AAB를 빌드하고, 저장소 Releases에 올립니다.

## 서명 키 (구글 플레이 업로드용)

저장소 Settings → Secrets and variables → Actions에 다음 2개를 넣으면 AAB가 서명됩니다(별칭은 `upload`, 키 비밀번호는 저장소 비밀번호와 같음).
`KEYSTORE_BASE64`(upload.jks를 base64로 바꾼 글자), `KEYSTORE_PASSWORD`

## 광고 (AdMob)와 구매

- 하단 배너(320×50) 한 곳. 퍼즐 판을 가리지 않도록 화면 아래 공간을 비워 둡니다.
- 보상형 광고는 결투에서 쓰러졌을 때 이용자가 원할 때만 봅니다(난이도 단계마다 한 번, 체력 절반으로 이어하기).
- `ads.json`에 AdMob 앱 ID와 배너, 보상형 광고 단위 ID를 넣으면 됩니다. 앱 ID는 모든 빌드의 매니페스트에, 광고 단위는 릴리스(AAB)에만 들어갑니다. 테스트 APK는 항상 테스트 광고입니다.
- 광고 제거: 한 번 구매(비소모성 `remove_ads`, $1.99). Play Console → 수익 창출 → 인앱 상품에서 같은 ID로 만듭니다. 구매하면 배너가 사라지고 이어하기가 광고 없이 됩니다. "구매 복원" 버튼은 타이틀에 있습니다.

## 개인정보처리방침

https://meero105-cloud.github.io/velvet-thorn/privacy/
