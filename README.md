# 몽글 롤링페이퍼

회원가입 없이 링크로 공유하고 메시지를 모으는 간단한 롤링페이퍼 웹앱입니다.

## 기능
- 롤링페이퍼 생성
- 공유 링크 복사
- 익명/이름 기반 메시지 작성
- 5가지 카드 색상
- 생성한 기기에 관리자 권한 저장
- 방장의 작성 마감/재오픈
- 모바일 반응형 UI

## 1. Supabase 만들기
1. https://supabase.com 에서 새 프로젝트를 만듭니다.
2. SQL Editor에서 `supabase/schema.sql` 내용을 실행합니다.
3. Project Settings > API에서 Project URL과 `service_role` key를 확인합니다.

## 2. 환경 변수
`.env.example`을 `.env.local`로 복사하고 값을 넣습니다.

```bash
cp .env.example .env.local
```

```env
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
```

> `SUPABASE_SERVICE_ROLE_KEY`는 절대 브라우저 코드에 넣거나 공개 저장소에 커밋하면 안 됩니다.

## 3. 로컬 실행
```bash
npm install
npm run dev
```
브라우저에서 http://localhost:3000 을 엽니다.

## 4. Vercel 배포
1. 이 폴더를 GitHub 저장소에 올립니다.
2. https://vercel.com 에서 저장소를 Import 합니다.
3. Environment Variables에 `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`를 추가합니다.
4. Deploy를 누릅니다.

## 보안 메모
- DB는 RLS가 활성화되어 있고, 브라우저가 Supabase에 직접 접근하지 않습니다.
- 관리자 토큰 원문은 DB에 저장하지 않고 SHA-256 해시만 저장합니다.
- 관리자 권한은 생성한 브라우저의 localStorage에 저장됩니다. 브라우저 데이터를 지우면 관리 권한을 잃을 수 있습니다.

## 다음 단계 아이디어
- 메시지 삭제
- 스티커/사진 첨부
- 공개 날짜 예약
- QR 코드
- PDF/이미지 저장
- 관리자 권한 복구용 비밀번호
