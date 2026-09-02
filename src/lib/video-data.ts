// ============================================================================
// Sample video content for the video design-system blocks (grids, rails,
// full-page hero, watch module). Real sample MP4s so players actually play.
// ============================================================================

export interface VideoItem {
  title: string;
  href: string;
  category?: string;
  duration?: string;   // 'm:ss'
  views?: string;
  date?: string;
  src?: string;        // playable MP4 (optional; thumbs link out by default)
  seed?: string;       // DummyImage seed for the still
}

// Public sample assets (mixkit / gtv) — fine for previews.
export const SAMPLE_LANDSCAPE = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
export const SAMPLE_VERTICAL = 'https://assets.mixkit.co/videos/preview/mixkit-news-anchor-talking-to-camera-in-studio-34062-large.mp4';

// Landscape (16/9) — grids, watch module, inline players
export const videoItems: VideoItem[] = [
  { title: 'നൂറ്റാണ്ടുകള്‍ പഴക്കമുള്ള പള്ളി വരെ പൊളിച്ചു; ബുള്‍ഡോസര്‍ രാജ്', href: '/story/ips-shrikumar', category: 'India', duration: '4:12', views: '154K', date: '6:41 PM', seed: 'vid-1' },
  { title: 'മരവിപ്പിച്ച ഇറാനിയന്‍ ഫണ്ടുകള്‍ക്ക് മോചനം; നിയന്ത്രണം തുടരാന്‍ അമേരിക്ക', href: '/story/pala-election', category: 'World', duration: '7:30', views: '98K', date: '6:39 PM', seed: 'vid-2' },
  { title: 'ട്രംപിന്റെ കല്‍പനകള്‍ക്ക് വഴങ്ങില്ലെന്ന് നെതന്യാഹു', href: '/story/vote-buying', category: 'World', duration: '2:48', views: '243K', date: '6:37 PM', seed: 'vid-3' },
  { title: 'ലെബനാൻ ജനതയുടെ ചങ്കിടിപ്പേറ്റുന്ന US ഇറാൻ കരാർ', href: '/story/sabarimala-traffic', category: 'Explainer', duration: '9:05', views: '67K', date: 'Jun 23', seed: 'vid-4' },
  { title: 'കേരളത്തിൽ കനത്ത മഴ തുടരുന്നു; റെഡ് അലർട്ട് പ്രഖ്യാപിച്ചു', href: '/story/rain-alert', category: 'Kerala', duration: '3:21', views: '112K', date: 'Jun 23', seed: 'vid-5' },
  { title: 'വയനാട്ടിൽ ഉരുൾപൊട്ടൽ; രക്ഷാപ്രവർത്തനം സജീവം', href: '/story/palakkad-hospital', category: 'Kerala', duration: '5:54', views: '88K', date: 'Jun 22', seed: 'vid-6' },
];

export const featuredVideo: VideoItem = {
  title: 'ഓപ്പറേഷൻ തൂഫാൻ; ലഹരി വില്പന ശൃംഖല തകർത്ത് പൊലീസ് — അന്വേഷണ റിപ്പോർട്ട്',
  href: '/story/ips-shrikumar',
  category: 'Investigation',
  duration: '12:40',
  views: '1.2L',
  date: 'Today',
  src: SAMPLE_LANDSCAPE,
  seed: 'vid-feature',
};

// Vertical (9/16) — shorts / reels rail
export const shorts: VideoItem[] = [
  { title: 'മീഡിയവൺ സ്റ്റുഡിയോയിൽ നിന്നും തത്സമയ വാർത്തകൾ', href: '/story/rain-alert', category: 'News Live', views: '154K', duration: '0:45', seed: 'short-1' },
  { title: 'കേരളത്തിൽ കനത്ത മഴ; റെഡ് അലർട്ട്', href: '/story/pala-election', category: 'Rain Alert', views: '243K', duration: '0:38', seed: 'short-2' },
  { title: 'വയനാട്ടിൽ ഉരുൾപൊട്ടൽ; രക്ഷാപ്രവർത്തനം', href: '/story/vote-buying', category: 'Wayanad', views: '98K', duration: '0:52', seed: 'short-3' },
  { title: 'മൊബൈൽ ഫോൺ തട്ടിപ്പുകൾ; ശ്രദ്ധിക്കുക', href: '/story/sabarimala-traffic', category: 'Cyber Alert', views: '115K', duration: '0:41', seed: 'short-4' },
  { title: 'വാർത്താ ക്യാമറയ്ക്ക് പിന്നിലെ നിമിഷങ്ങൾ', href: '/story/india-ireland-odi', category: 'Behind the Scenes', views: '67K', duration: '0:33', seed: 'short-5' },
  { title: 'സ്വർണ വില റെക്കോർഡിൽ; പവൻ 75000', href: '/story/gold-price-record', category: 'Business', views: '54K', duration: '0:48', seed: 'short-6' },
];
