'use client';

import { useEffect, useState } from 'react';

interface UserData {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code: string;
  is_premium?: boolean;
}

export default function Home() {
  //const [initData, setInitData] = useState('');
  const [userId, setUserId] = useState('');
  //const [startParam, setStartParam] = useState('');
  const [userData, setUserData] = useState<UserData | null>(null);

  // Для реферальной логики
  const [referrer, setReferrer] = useState<string | null>(null);
  const [referrals, setReferrals] = useState<string[]>([]);

  useEffect(() => {
    // Инициализация TWA SDK
    async function initWebApp() {
      if (typeof window !== 'undefined') {
        const WebApp = (await import('@twa-dev/sdk')).default;

        // Делаем веб-приложение «готовым»
        WebApp.ready();

        // Сохраняем initData (если нужно)
        //setInitData(WebApp.initData);

        // Берём userId и startParam (если кто-то зашёл по чужой рефссылке)
        const currentUserId = WebApp.initDataUnsafe.user?.id?.toString() || '';
        const param = WebApp.initDataUnsafe.start_param || '';

        setUserId(currentUserId);
        //setStartParam(param);

        // Заполняем userData (для отображения в интерфейсе)
        if (WebApp.initDataUnsafe.user) {
          setUserData(WebApp.initDataUnsafe.user as UserData);
        }

        // Если startParam есть, значит нас пригласили по рефссылке
        // и мы должны POST-нуть, что "userId был приглашён referrerId"
        if (param && currentUserId && param !== currentUserId) {
          await fetch('/api/referrals', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: currentUserId, referrerId: param }),
          });
        }

        // Затем запрашиваем у бэка список своих рефералов и ID реферера
        if (currentUserId) {
          const resp = await fetch(`/api/referrals?userId=${currentUserId}`);
          const data = await resp.json();

          if (data.referrer) {
            setReferrer(data.referrer); // кто меня пригласил
          }
          if (data.referrals) {
            setReferrals(data.referrals); // кого пригласил я
          }
        }
      }
    }

    initWebApp();
  }, []);

  // Клик по кнопке "Invite Friend":
  // можно просто открыть t.me-ссылку с параметром start=[userId]
  const handleInviteFriend = () => {
    if (!userId) return;
    window.open(`https://t.me/bbookkeee_bot?start=${userId}`, '_blank');
  };

  // Копируем реферальную ссылку в буфер
  const handleCopyInviteLink = async () => {
    if (!userId) return;
    const link = `https://t.me/bbookkeee_bot?start=${userId}`;
    try {
      await navigator.clipboard.writeText(link);
      alert('Invite link copied!');
    } catch (err) {
      console.error('Failed to copy link', err);
    }
  };

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">Telegram Referral Demo</h1>

      {userData ? (
        <>
          <ul className="mb-4">
            <li>ID: {userData.id}</li>
            <li>First Name: {userData.first_name}</li>
            <li>Last Name: {userData.last_name}</li>
            <li>Username: {userData.username}</li>
            <li>Language Code: {userData.language_code}</li>
            <li>Is Premium: {userData.is_premium ? 'Yes' : 'No'}</li>
          </ul>

          {/* Если нас кто-то пригласил */}
          {referrer && (
            <div className="text-green-600 mb-4">
              You were referred by user {referrer}
            </div>
          )}

          {/* Кнопки */}
          <div className="mb-4">
            <button
              onClick={handleInviteFriend}
              className="bg-blue-500 text-white py-2 px-4 rounded mr-2"
            >
              Invite Friend
            </button>
            <button
              onClick={handleCopyInviteLink}
              className="bg-green-500 text-white py-2 px-4 rounded"
            >
              Copy Invite Link
            </button>
          </div>

          {/* Если у нас есть рефералы, показываем список */}
          {referrals.length > 0 && (
            <div>
              <h3 className="text-lg font-bold mb-2">Your referrals</h3>
              {referrals.map((r) => (
                <div key={r}>User {r}</div>
              ))}
            </div>
          )}
        </>
      ) : (
        <div>Loading...</div>
      )}
    </main>
  );
}
