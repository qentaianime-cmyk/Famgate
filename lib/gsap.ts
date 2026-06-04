import { gsap } from 'gsap'
import { SplitText }    from 'gsap/SplitText'
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin'
import { ScrollTrigger }  from 'gsap/ScrollTrigger'
import { CustomEase }     from 'gsap/CustomEase'
import { DrawSVGPlugin }  from 'gsap/DrawSVGPlugin'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(
    SplitText,
    MorphSVGPlugin,
    ScrollTrigger,
    CustomEase,
    DrawSVGPlugin,
  )

  // Qash signature easing — fast start, elastic settle
  CustomEase.create('qash',   'M0,0 C0.22,1.2 0.36,1 1,1')
  CustomEase.create('qash-in','M0,0 C0.55,0 0.85,0.8 1,1')
}

export { gsap, SplitText, MorphSVGPlugin, ScrollTrigger, CustomEase, DrawSVGPlugin }
