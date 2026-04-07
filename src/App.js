import React, { useState, useEffect, useRef } from 'react';
import { jsPDF } from 'jspdf';
import './App.css';

// Logo Blue Express
const BLUEX_LOGO_WHITE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAn8AAAFCCAYAAACAQrsVAAAazklEQVR4nO3d2bbiOrIFUPuM/P9fdj1kUkmyAXdqIqQ5n+64dRLLakILGdjr0ti2bVvra85gXde1dxvo73V9mRcAvKq+MQh78QgE4zi7vow9ANU2AqEvH8Egj7vry1gDzKv4BiD0jUVIiKXk+jK2AHP6r3cDiG37o3c7KM+4Asyp6Dt/m8kcnBj1UWt9GU+AuRQr+oLfnASHNmqvL+MIMI8iBV/wY1kEiFparS/jBzAHn/mjGJ8PLK9lfxo7gDn8uvsCNgxePc8Jp0kAEIuTP6ry5gAAYrl1KmNj5wyngOf0Wl/GCWBsTv5oxmcCAaA/4Y/mBEAA6Ody+LOBc4dTQADow8kfXQmAANCW8Ed3AiAAtCP8EYIACABtCH+EIQACQH3CH6EIgABQl/BHOL4JDAD1CH+EJQACQHnCHwDARIQ/QnP6BwBlCX+EJwACQDnCHykIgABQhvAHADAR4Y80nP4BwH3CH6kIgABwj/BHOgIgAFz3q3cDrlrXde3dhuiEJADgVdrwx753AXmUQLht2+YNAACc57HvZNY/ercDAOhD+JvU+qR3W64a5RQTAFry2Jd/Hg8LVAAwNid//CPbaaCwCgDnCH+8lS0EAgDHCH98JQACwFiEP3ZFD4Ae/QLAccIfh3gMDABjEP44RQAEgNyEP06LGAA9+gWAY4Q/LokYAAGAfcIfAMBEhD8ui3b659EvAOwT/rglWgAEAL4T/rhNAASAPIQ/AICJCH8U4fQPAHIQ/hiKL30AwHfCHwDARIQ/ivHoFwDi+9W7AQAA39z9SI/DiX8JfwBACLU+t/3pdWcNhcIfANBchC/ovWvDDIFQ+AOmcXSzmaH4Z3VkDI1fXBEC357XNo44n4Q/ilrXdc2wuJnL2Tn5+O9HLPoZGb/csu8Jz+0fZU4Jf8Cw7m46QkR/d8bQ+PWTPfB9MkoQFP6A4ZTeeLZt2zIX+oxKjqEQ2Maoge+TzEHQ7/wBHDDbxgZnzL4+st2/8AcMpWYRzlbgs2r9cx9ct/3Rux0RZOoL4Q8YRovCm6W4Z1W7f41fGZmCTmsZ+kb4AyCEVhtm9I05sgzBJorIfSX8AUNoWWSjFnSOM4bnRA4y0UXsN+EPSC9iceUcYxiXsbkvWngW/hhKtq/bk1ekQg41RAssI4jSn8IfRUWZ2EAeveqGevWe0FdXhL4V/gCAZVliBJMZ9A7Ywh+Qms0KyrCW2uvV58IfAEys9ynU7Hr0vfAHANBR6wD4q+aLX/3mpXcgOfUeN9/0BTiud83mX9u2ba32saLhr1SjX1/HBAWAcuyrMbUKgJfD37qua6tGOtGJTyEByEG9ju0xPjWzz63P/AllRGEuAuwT/PKoOVa+8AEAExD8eBD+uE1BAYhNnc6p1rgJf6TnkS/AZ4JfbjXGT/jjFkUFIC41egylx7Hq7/w9O9JwJzi5KCoAcanRYyn5CytVwt/VCff674TBuKIUFXMEYHwlan2UfeuOUgGwaPgr3bEtfusGAEaTPejU2PefXzN7/9xVJPzV7kQhMJYoi8Z8APgpSo0+o3U9zxwES5z+3Qp/rTvs+Xo2/j6yLRKAmWSr0RH28oxB8G4AvBT+InROyz+ATIwxf2bsAfKKWsMf7Yq255V2+qdeInXI9kfvdoxOHwPEl6FWr3/0bseeDO28M96Hw1/koBW1XSOI2LfRFyRAaxFr9auMtTtjm484FP4yTKoMbcxGnwJwV4ZTtG8it//qPr0b/jIFgExtjSzyKW/UBQjQS9R6vSxj1eyo93Jl/L+Gv8gT6pOMbY4icuhblrgLD6CXqDU78mnZHVHv6ew8GPJv+0ZdDFFFD30A5BE1IJUywv19/KkXYWBs2cZ3hMUGUFLEOj5LrY74kzBnfgLvbfiLdDNX+R3An7KOq3EEiE+tzuNH+MsaEN6ZOQCOMo6zjh/AN9Fq/Ky1el3XNdpYHFHkb/tGNmIAzDjRrhht3ABKiLYHzF6rIwXAo5nnn/AXpfGZ6LM6Zi8mABmo1b9FCoBHDPlt31e1BiTTQGeimAC8F2nfUav/FaU/jsyR/4e/SBMqA/1VR5TFAwCjmuLkrzTBrw7BDyAH9fq9KP2yl1P+O/IfjWCGe8wsyoIBiCrKPqZef5ehf5z8nRRl8Y0kw0IBQL0+KkI/fcsrwh9dRVggANE5eKCkqcKfxRPHqH/0G2BUavY5kfvrP4GI1iIvCIBo7NNc9WnuTHXyR19O+wByUruvidpvwh9NRF0AAHynfo9H+KMJjy0AzlM78+sdnt/NoenCn4XUz/akd1sA2Nc7uFDHdOGPGIRAAOhD+KMrIRDgPbVxHL1PUF/nkvBHCEIgQCy9Awv1CH+EIgQCMKJIYVr4IyQhEJhZ7/oXKahQ3nThz4TOpXcBBIDRTBf+yEcABGAEPQ+gnvdS4Y8UPAYGaMMTsvEJf6QiAALAPf9J+GQjAAIjU+OozckfKSmOAHDOY++cKvyVOOV0UhqHAAhQlj2uvgh9PFX4KyXCwPGbL4IAI1HPaOG/ZZkjzMxwjzNTMAHgGCd/F61/9G4HfwmAALDv/+FPkLlmfdK7LQiAAFfZx+awbdv2q3cjWmg1oTMsHOEIAPpa13XtuR//E/56N4b63gXU0cZ827YtQxAH4LPR9qZIhj/5EwL2jRgIBUCAnLLvPxn8+MLHSBvmSPfS2gifZVRAAHJRt9t4+23fzBv+wwj3EMX6ond7zlBIgCx61qsItV29bufjT71EmAjElDEEAhCX4NfWkL/zJ5i0kSUEKioA8NfX8JdhY3+Vsc3Z6XMAyGP35C/Txp6praOJfgro9A8gJvW5vUOPfSNv6g8Z2jgD4wAAsR3+zF/Uk52o7ZpZ1DHx7hIALnzhI9KmHqkt/GR8ACCeS9/2jbCpR2gD+6KNk9M/AGZ3+adeej3ai/pIkc+MFwDEcftv+z5v7DVPVQSI3NZ1XZ26AUB/t8Pfs9JBUOAbS5QAuG3bZm4BMKui4e/Zu83128ZvM55DlAAIADNa13WtFv4+XbDl9eATp38AzGrIv+0LAMC/Hocewh/NOXEDgH6EP7oQAAFYFvtBK8/9LPwxLV88AWAGrwH7VvizeQJAfvbzcb07Wb0c/h4TZfvjTsOOXu9Z7etRn6N+gL9mrokz33tNn/q12E+9vAayuwMp4AHAPPwObDl7Gaza7/wZQADgjEdokSGuOXrw1vRHngEA9ngMXJdv+wIATET4Y2oeLQD8ph7OQ/ijK0f7ZGazBDIS/gAAJiL8AUAQnobQgvAHADAR4Q8AWJbF51hnIfwBqXlMlpuwAe0JfwAQiDc01Cb80ZV3/QCxqMvjE/4AbrBR5uWEjVkJfwB0IThDH8IfAATT+1RSMB+b8MfUehdYAGhN+APS6x3inZIwIvN6XMIf3SgsMC/rH/oR/gAKEGZy6X1afESENprXYxL+gCFE2Cg5RqCAvoQ/ulD8AXJQr8cj/AEUYpPcF6GPMp0SZ2oreQh/NBeh+C+LokodUeY3lGRej0X4A4Yh0McmQFxjXlOa8EdTij8zMM8ZkXk9DuGPZhQOZmK+/ytKfzhFuyfKOM5ie1LydX+VfDH4RMGAeVn/963ruurH8X0b49f/7c4bGSd/TMm7/3FFGlubtT4YkTEt78rp3p0TQeGP6hQKZmb+xxHpjcEVkdpvXpdR4pHulX8v/FFVxAIRqYBSR7QxjrgOWpj1vmdhfO8p2X9nX0v4oxqFAf6abT1Eu99obwiuinYf0cY5ixr9duY1hT+Kq/HNJBjBLOtilvvkN+N9Ts3+Ovrawh9FRS8C0d41U0/UsY6+Ru4a/f4iiDi3jfsxUfpJ+KMIp31w3KhrJep9RQxLI4o6/hG03COPXEf447YsC94GMJ/IY55l3Rw12v1EF3Vumwc/RewT4Y/LnPaRQdRNcllibgpnRa8Dkcf/rqj3Fnk+tNarL/au6y98cFrGhR21SMJjPWWcoxlrAW1s27ZlnNOlRF8bwh+HRJ/IkF2mzTJLPcjSn3dE/rNvmd/Y3BF1PJ557MtH25PebbljtsLDT1nmQIb1Fr19M4o+v2eZMxnW74OTP/4vy6SFKyKfkLyKdmKSpd+eRek7fos2p0vKuD6EvwllnKhXjVhomMfzWu0xl7PWihnXfZY3NyOFwAz9/cnlzs9808whe3Hptcay99ue7LWr9vhk759lGX8Of5Nt/DKOVZY+/ta3Tv4AEnndeO5unlk2sqMyhomZZToJHGmtOPljSBkKyR4nf/WoX2OaYe4ekX1+RxrHrH2514dO/hhOpMJBTFk+H8Vx1v1f2ed3z8+6Zu63M4Q/hmID4KjsGyR8M8r8/nQPPu7w2ZG+Ef4YhuDHWaNskLOz9t8beX6Pel+t+JFnhqD4w5ysffjr6HoQ/khP8ecO8ycvY7dPH/GO8EdqChslmEeMzPyew5lxFv5IS0GjJPMpF+N1jv4a29nxFf5ISSGjBvMqB+N0jX4bz/rH2X8n/JGOAkZN5ldsxueeq2GBeO6Mo/BHKooWzMv6h9/urgXhjzQUflpxOhKP8ShLf+ZVYuyEP8KzEdOLeReDcahDbc2n1HhdDn8mDC2YZ+355fx/mYN96f/69HF8pYO6kz9C8o60H/3+kz5pTw1oS1/HVWNshD/CUYSIyLxsR1/3od/jqTUmwh9heKdPdOZnffq4L3U4jprjcPuFfT6IuxSa93qtLeNxjNpXnrkXizneR4t18Kv2BeAThZ7M1nVdbY5lqAUxPcbFPG+j5ToociETg6MU+XNary3jc40aeJ05l4M5XlfrdeDkjyYUeEbmFPAadSEPp4B19FoDxS5qQvCO4n5fy7VlvO5TC/eZZ/mZ5/f0XgNFL24y0HtCj6jVujJ2ZamHP5lj4zHPz4uwDoo3wESYT4SJPLra68oY1qEe/mZ+jc9c/y7aGqjSGJNgbNEm8SxqrSvj2caMddHcms+M8/ybqGugaqNMgvyiTtxZlV5Txre90euiOcXD6HP9kwxroHoDZx38jDJMWMqtKePd14i10ZzinRHn+juZ5n/zhs4yCSLJNCE57upaMh/iyVwXzSfOyDzX38k6/1M2GvjXkYKatUjNJsPmaC5RSob5/myUuT/ETQCMqvfmOMpmRw695/uzkef+sDcGMCrf/GZG5j0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADUsPZuwDvbtm1H/9t1XUPeAz8Z138990eL+x2t/zPfT+a2A/mFKCpnCuGeGoXyU/siFeV3bbzSvlKv8+31rmjd1zXG/EhflLzP6OvqiqzzaVnGHA8gp64FpGQxfNVqE41QhEu1r8Xr3NWqv0uO+dn+uHuPI/T/s5r381DrvjK3HRhXl6LRoiA+tNhIexbfvfYdbVuJ+8w0rt+07NM7r1/qeldECOE1RD15PUIIBI4K8SithdobauQTkSNtuxv+eo1ty8f8Z657tz+inLTuyXxi9k3k09c9QiCw579WF+pdzGtfv/X9RQqlPce297x6p2Wbet9/jev3vqdHG6604+q/KylCG4DYqoe/SIUoSjvuinQfEdoSoQ3LUm6uHz2pjXTfEV+rtWhtj9YeII6q4S9i8an54fto91v71C/S/fYOQzOd9r0TsU0ljHpfwNx+9W7Aq9rfpHz8mzPXWdd1PXqds699VpTN6Eo7WnxhpHb/11az7bXfyNzt+8xvzDK3HZhPmJDS4wPWNYNmry8iXL3+kdd+vGarfri66bX+hvfdzblmECgxD1tcs+XaKn0/retC7zoE5Ffl5K9HcboSTDKJUvCPtqNEG66OacvTv5ZhrNccOHPyXVvJebUs5X7W5+x1S7xOlDGpqWW9qeFb+6O2mTmkOp2K0IZe91e7CB497Wq5WT5rcbJ75lqRT0EjjEGN08web2qOfvlm77+J2vao7gTbnvfd62kFbbT+WFHN2lL0JiJsUC3aEvUxT49HrKWuf0SrU7ZSQfhOG660qeT17rbjTFt6h6d3bZmh7dHUOMls0Rel2x3hyU1JrWtgKzXGqeU+3CX8RXskF/kzShGvU/raZ9Xuk1JFZrTg91C6PZEC1FmZ2x5Fi0096kb9Tek2RwhPNd+Qt9bjyd4Ze+0r9lMv0TaoM9eq/Ujx6sBGOkmNdO0WfX/XqMHvzLUiFmxiaTVHtj+ivVaE67Q02v3cVXOM91672V/46KXmplgzhAh+Ma97ROS2lTLDPVJPr2Bz95oZ2xzNiKH2rJZ98OlaRcJfxNOJs64ORO97mjH4ndVqka1/lHq9mdcV4+o9J1o8iSmtd5/VMOI9HdHrvl+v2+zkL/IG1crRQc+w6UcYzwhtAI7LuuFHaPeIJ2aj3c+e3vf7fP3hH/suS/2QUPLxb4bgx08zPv42Bzmj98Z3VdZ2E0u0eXQ7/B25oSybxJ3BKXGPWYJf7+s/G/XLB9ZV+dfoJXPbS8naBxHbHbFNd4x2P+9EvMdwf9u3lnWt/1cKjl7j8d88b94RJwfHZAlhNbRYVw/blvfvNmdue2+l3+C1esO4d507rz/bfGpZZ47I8IsTe6YJf61cmaRn/vveC7739d/pWRgi9sfIom16Z+beuzd9M7iyNq/00ePffLtepI8A3X3zX2sttHyK9fzf710347pp9TTxyhufW499R3o01cPZiaEveRhpLpy9l+wffM/c9rNaBb+S/35Z2re79C8F9Dba/bR2tu+O9Pfr/z7FFz7OKFGYayd2rsmy6WZp58ORubl3T1fmd5QQeKftEdofSak697oZ1gwjJV/7yhuhEtetZYTHo1ddfQNR403Eu//fVI99Wz4eLHktwS8m4xLD6zrLNi7P7c/W9m8iPNm4Gsxrvv6R1zzThmgfhXjVct/NrOQYHnktJ38VRV6QV0S+n8ht45hSY9jjVC1z2yPIuH5rtjljf/BXhDc+e6qf/M1WxEpTBHhn1HVV+pSg5ala5raX1vv07KpI62qkE7Oj9xL9FPOIDMFvWZz8VXf3+X3JtkAGteZ9i1O1Wp8tm/VEMKpotdm8yKnnPBL+GrgywNGKC/8yPnXV/ID+stT/skjmtrcUaR1F7NNI/UNZvcdW+APCql0gawapVm2PGFpG1nvTJq5Ma3Gqb/tmMsJnH6CExzqoWVgfr116zT2/Xu32R6kXR+8zSnujG+mzf61Ef0MXYe47+XtR6/M6Lf8dRFNiXa0vSrTrVe2TQI+DqSXy2Ld8Q9DiTeIIhL8nkYJfqX8PvdUKPDWDYIsvhWRs++winNjQ1yjrq/pj35kXyyiThHhmXlfvtHq8WkONtkd6DMzcsq3HWTj5q6TkhLd44LhSp2o91l3tx9rQ0pk1ZM63JfwlESEARmjDJ5HbRj93w1TPeZW57czN50/j823fCs5+uPXof+9Rzj36bm5n11skmR9rk0uvE+/W15zdrZO/IwM2W6G68q2mMxN/tv6ckXVV19nTtGh9nbntkN0oQdVj34Jm+H2riJtJxDYRX+Z1mLntmUWuNVnnRNZ2Zyf8FXK3KHg3D+1l3niitj1qu5hDzfk30ty+/Zm/dd3/9fHRP6tW6htNR/ry+Zoj92lpI/aVOUDm+hu1XdGM/Ga/1vibV/uc/DV0ZEJmOAGMVIwitaUkxasdfc0Zo9ac1mZedxHmULPwF+Fma6jxOT8BkKOMA5lFmr8Rw0ik/ill5N+xzHRfRcLf0RsebSLX/hNQEdoR2ehfsJl1XZFf1jV3VLQ1l6G/Rw59V/SeQx77XuSXy/tO3t4LB7KIXn8ireVIfRWpX+6K1K/8VuxHno9+WaH3h3zftTHqt4MyfAGk93juidy2I2ZYV8//ttccLvFvs8+10jLUrzse91aj3dmDX7ax7KXnvC960cinYXttq/GYtdQ9tujXlj9Vc8fZdl5p15FrtJy/o66rT/822j0sy882ffs30eZGtDcF35Rs651g3nPN1eqz0T8mE0nPeX9U0ce+UT+nVvJaPRZQ1H5tfd0MC6qGqONf61rbHzVeu4XMbS+tZug68zo1x6TUfL3yOqPUuNH0mvevr/ntdYt/5i/aRpU9+F15zVr9uteGmpv27EXx7PjXXltnHudd/fdR7uPMqd/zfxOx7T1c2Qiv9t23f1v7NO9uu6/8O8ZR8o3P82t9et1in/m76tGw3kfnrV9vZCXHVL9ft23lP0/SI4RnqRHfrpGx7b2d6bszb0ZqB+Kj7b47hhGCfUuR5vyRvj/zmdeHu/Xi2xuf19esNnmuDtTdCV3jurXfMZ5Rqy1nThFaBIA7C73FHOpVeK/0S88Q/unaPTe+Emuo1/zsEb5LybZ5L0usNj+rWVMjzZmHiONQ8k1Jq2s8v16YoPJOi849cp1oi6ZGADwbeEpufiUXdqug07NAzrauel6rVng9co2717KJfxbhYzR3CH/9ZX0D8Wh39UGOduOvsgW/h9IB8ErgiTa2pcYgevhblnh9/yprYXzWMryW1nt+fhOh3658DrFWW85ocWocce5E6f9nWd9APNpd/UeeI06kZTn2a+ORBiyiSGMbqS0tRL3fI+vq9b+v2Z6rjrTr7L22ErFNz3q378r1e7c5Shu4JuLYNfkLH9FuvHR7etxflD6N0I4IbeghWvi42pbs95G57b30aued6/bs2yzjymfRxrDZn3eLUuBHCH4Rrv2sZyGP0gc9ReiDEm2IMJ6ZA2zv65/Vur1Z52i2ceWz3mP5fP20H1o/60qn77Wx90A+lGhnqc+5tRrXmn2fZdzfybCujmp5L6XvY6RxaKFmf9Xqm9pj3GtORpxLET+CdbefeteI7oMcfQF9a1+kRfKpnUfbWPpLDjXGtWV/Zxn3T6Kvq7MyhoOHzG3voVR/teqb0uPrje1PI4a/ZWlzX5/aGWago/3cx7PXtmVZIKXD2tX7bvHTJDVkGfc92TbTPS1+hqaWzG3vofSvGtR2Z3x7v7mN0H97IoTAGv3U4w1E6MHO8JMbo2jZ19lP1bIbdV1lD+vZ2w/c1+oNhOLCsizjBgIAyKrWYUn3v+0LAMBPtQ5dmv3UCwAA/Ql/AAATEf4AACYi/AEATET4AwCYiPAHADAR4Q8AYCLCHwDARIQ/AICJCH8AABMR/gAAJiL8AQBMRPhjWZZ6fzwaAIhF+OMQ4RAAxmBD54dt27bH/y30AcBY/geOnraAi9sfmQAAAABJRU5ErkJggg==';
const BLUEX_LOGO_BLUE = 'data:image/png;base64,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';
 
const BlueExpressLogo = ({ width = 160, white = true }) => (
  <img
    src={white ? BLUEX_LOGO_WHITE : BLUEX_LOGO_BLUE}
    alt="Blue Express"
    style={{
      width: width,
      height: 'auto',
    }}
  />
);


function App() {
  const [processes, setProcesses] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    objective: '',
    steps: [{ text: '', image: null }],
    requirements: '',
    risks: '',
    approvedBy: '',
    version: '1.0',
    date: new Date().toISOString().split('T')[0],
    headerImage: null,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [view, setView] = useState('list');
  const [previewProcess, setPreviewProcess] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const fileInputRef = useRef(null);

  // Cargar procesos del localStorage
  useEffect(() => {
    const saved = localStorage.getItem('bluex_processes');
    if (saved) {
      try {
        setProcesses(JSON.parse(saved));
      } catch (error) {
        console.error('Error al cargar procesos:', error);
      }
    }
  }, []);

  // Guardar procesos en localStorage
  const saveProcesses = (updatedProcesses) => {
    setProcesses(updatedProcesses);
    localStorage.setItem('bluex_processes', JSON.stringify(updatedProcesses));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStepChange = (index, value) => {
    const newSteps = [...formData.steps];
    newSteps[index] = { ...newSteps[index], text: value };
    setFormData((prev) => ({ ...prev, steps: newSteps }));
  };

  const handleStepImage = (index, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const newSteps = [...formData.steps];
      newSteps[index] = { ...newSteps[index], image: e.target.result };
      setFormData((prev) => ({ ...prev, steps: newSteps }));
    };
    reader.readAsDataURL(file);
  };

  const removeStepImage = (index) => {
    const newSteps = [...formData.steps];
    newSteps[index] = { ...newSteps[index], image: null };
    setFormData((prev) => ({ ...prev, steps: newSteps }));
  };

  const handleHeaderImage = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setFormData((prev) => ({ ...prev, headerImage: e.target.result }));
    };
    reader.readAsDataURL(file);
  };

  const addStep = () => {
    setFormData((prev) => ({
      ...prev,
      steps: [...prev.steps, { text: '', image: null }],
    }));
  };

  const removeStep = (index) => {
    if (formData.steps.length > 1) {
      setFormData((prev) => ({
        ...prev,
        steps: prev.steps.filter((_, i) => i !== index),
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('El nombre del proceso es requerido');
      return;
    }

    if (isEditing) {
      const updated = processes.map((p) =>
        p.id === editingId ? { ...formData, id: editingId } : p
      );
      saveProcesses(updated);
      setIsEditing(false);
      setEditingId(null);
    } else {
      const newProcess = {
        ...formData,
        id: Date.now().toString(),
      };
      saveProcesses([...processes, newProcess]);
    }

    resetForm();
    setView('list');
  };

  const resetForm = () => {
    setFormData({
      name: '',
      objective: '',
      steps: [{ text: '', image: null }],
      requirements: '',
      risks: '',
      approvedBy: '',
      version: '1.0',
      date: new Date().toISOString().split('T')[0],
      headerImage: null,
    });
  };

  const handleEdit = (process) => {
    // Compatibilidad: convertir steps string a objeto
    const steps = process.steps.map((s) =>
      typeof s === 'string' ? { text: s, image: null } : s
    );
    setFormData({ ...process, steps, headerImage: process.headerImage || null });
    setIsEditing(true);
    setEditingId(process.id);
    setView('form');
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este proceso?')) {
      saveProcesses(processes.filter((p) => p.id !== id));
      if (previewProcess && previewProcess.id === id) {
        setPreviewProcess(null);
      }
    }
  };

  const getStepText = (step) => (typeof step === 'string' ? step : step.text);
  const getStepImage = (step) => (typeof step === 'string' ? null : step.image);

  const generatePDF = (process) => {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageHeight = pdf.internal.pageSize.getHeight();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 15;
    let yPosition = margin;

    // Encabezado corporativo Blue Express
    pdf.setFillColor(0, 51, 160);
    pdf.rect(0, 0, pageWidth, 32, 'F');

    // Línea accent
    pdf.setFillColor(0, 163, 224);
    pdf.rect(0, 32, pageWidth, 3, 'F');

    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(22);
    pdf.setFont(undefined, 'bold');
    pdf.text('blue', margin, 14);
    pdf.setFontSize(12);
    pdf.setFont(undefined, 'normal');
    pdf.text('EXPRESS', margin, 22);

    pdf.setFontSize(9);
    pdf.text('DOCUMENTACIÓN DE PROCESO', pageWidth - margin - 55, 14);
    pdf.text(`Versión: ${process.version}`, pageWidth - margin - 55, 20);
    pdf.text(`Fecha: ${process.date}`, pageWidth - margin - 55, 26);

    yPosition = 48;

    // Título del proceso
    pdf.setTextColor(0, 51, 160);
    pdf.setFontSize(18);
    pdf.setFont(undefined, 'bold');
    pdf.text(process.name, margin, yPosition);
    yPosition += 12;

    // Objetivo
    pdf.setFontSize(11);
    pdf.setFont(undefined, 'bold');
    pdf.setTextColor(0, 51, 160);
    pdf.text('OBJETIVO', margin, yPosition);
    yPosition += 2;
    pdf.setDrawColor(0, 163, 224);
    pdf.setLineWidth(0.8);
    pdf.line(margin, yPosition, margin + 30, yPosition);
    yPosition += 6;

    pdf.setFontSize(10);
    pdf.setFont(undefined, 'normal');
    pdf.setTextColor(60, 60, 60);
    const objectiveLines = pdf.splitTextToSize(
      process.objective,
      pageWidth - 2 * margin
    );
    pdf.text(objectiveLines, margin, yPosition);
    yPosition += objectiveLines.length * 5 + 8;

    // Requisitos
    if (process.requirements) {
      pdf.setFontSize(11);
      pdf.setFont(undefined, 'bold');
      pdf.setTextColor(0, 51, 160);
      pdf.text('REQUISITOS', margin, yPosition);
      yPosition += 2;
      pdf.setDrawColor(0, 163, 224);
      pdf.line(margin, yPosition, margin + 30, yPosition);
      yPosition += 6;

      pdf.setFontSize(10);
      pdf.setFont(undefined, 'normal');
      pdf.setTextColor(60, 60, 60);
      const reqLines = pdf.splitTextToSize(
        process.requirements,
        pageWidth - 2 * margin
      );
      pdf.text(reqLines, margin, yPosition);
      yPosition += reqLines.length * 5 + 8;
    }

    // Pasos
    pdf.setFontSize(11);
    pdf.setFont(undefined, 'bold');
    pdf.setTextColor(0, 51, 160);
    pdf.text('PASOS DEL PROCESO', margin, yPosition);
    yPosition += 2;
    pdf.setDrawColor(0, 163, 224);
    pdf.line(margin, yPosition, margin + 45, yPosition);
    yPosition += 8;

    pdf.setFontSize(10);

    process.steps.forEach((step, index) => {
      const text = getStepText(step);
      if (text && text.trim()) {
        if (yPosition > pageHeight - 30) {
          pdf.addPage();
          yPosition = margin;
        }

        // Número en círculo
        pdf.setFillColor(0, 51, 160);
        pdf.circle(margin + 4, yPosition - 1, 4, 'F');
        pdf.setTextColor(255, 255, 255);
        pdf.setFont(undefined, 'bold');
        pdf.setFontSize(8);
        pdf.text(`${index + 1}`, margin + 2.5, yPosition + 1);

        pdf.setFont(undefined, 'normal');
        pdf.setTextColor(60, 60, 60);
        pdf.setFontSize(10);
        const stepLines = pdf.splitTextToSize(text, pageWidth - 2 * margin - 15);
        pdf.text(stepLines, margin + 14, yPosition);
        yPosition += stepLines.length * 5 + 8;
      }
    });

    yPosition += 4;

    // Riesgos
    if (process.risks) {
      if (yPosition > pageHeight - 40) {
        pdf.addPage();
        yPosition = margin;
      }

      pdf.setFillColor(255, 240, 240);
      const riskLines = pdf.splitTextToSize(process.risks, pageWidth - 2 * margin - 10);
      const riskBoxHeight = riskLines.length * 5 + 16;
      pdf.roundedRect(margin, yPosition - 4, pageWidth - 2 * margin, riskBoxHeight, 3, 3, 'F');

      pdf.setFontSize(11);
      pdf.setFont(undefined, 'bold');
      pdf.setTextColor(200, 50, 50);
      pdf.text('RIESGOS IDENTIFICADOS', margin + 5, yPosition + 4);

      pdf.setFontSize(10);
      pdf.setFont(undefined, 'normal');
      pdf.setTextColor(80, 80, 80);
      pdf.text(riskLines, margin + 5, yPosition + 12);
      yPosition += riskBoxHeight + 10;
    }

    // Pie de página
    const footerY = pageHeight - 20;
    pdf.setDrawColor(0, 163, 224);
    pdf.setLineWidth(0.5);
    pdf.line(margin, footerY, pageWidth - margin, footerY);

    pdf.setFontSize(9);
    pdf.setFont(undefined, 'bold');
    pdf.setTextColor(0, 51, 160);
    pdf.text('Aprobado por:', margin, footerY + 8);
    pdf.setFont(undefined, 'normal');
    pdf.setTextColor(60, 60, 60);
    pdf.text(
      process.approvedBy || '_____________________________',
      margin + 25,
      footerY + 8
    );

    pdf.setTextColor(150, 150, 150);
    pdf.setFontSize(8);
    pdf.text('Blue Express — Documentación de Procesos', pageWidth - margin - 60, footerY + 8);

    // Descargar
    pdf.save(`Proceso_${process.name.replace(/\s+/g, '_')}.pdf`);
  };

  const filteredProcesses = processes.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.objective.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-container">
          <div className="header-left">
            <BlueExpressLogo width={140} white={true} />
            <div className="header-divider"></div>
            <div>
              <h1 className="header-title">Documentador de Procesos</h1>
              <p className="header-subtitle">Gestión documental empresarial</p>
            </div>
          </div>
          <div className="header-right">
            <span className="header-badge">{processes.length} procesos</span>
          </div>
        </div>
        <div className="header-accent-line"></div>
      </header>

      <main className="main">
        {/* ── LIST VIEW ── */}
        {view === 'list' && !previewProcess && (
          <>
            <div className="toolbar">
              <div className="search-wrapper">
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  className="search-input"
                  placeholder="Buscar procesos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button
                onClick={() => {
                  resetForm();
                  setIsEditing(false);
                  setView('form');
                }}
                className="btn btn-primary"
              >
                + Nuevo Proceso
              </button>
            </div>

            {filteredProcesses.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📋</div>
                <p>
                  {searchTerm
                    ? 'No se encontraron procesos con esa búsqueda'
                    : 'Aún no hay procesos documentados. Crea el primero.'}
                </p>
              </div>
            ) : (
              <div className="processes-grid">
                {filteredProcesses.map((process) => (
                  <div key={process.id} className="process-card">
                    {process.headerImage && (
                      <div className="card-image-wrap">
                        <img src={process.headerImage} alt="" className="card-image" />
                      </div>
                    )}
                    <div className="card-body">
                      <div className="card-version-row">
                        <span className="version-tag">v{process.version}</span>
                        <span className="card-date">{process.date}</span>
                      </div>
                      <h3 className="card-title">{process.name}</h3>
                      <p className="card-desc">
                        {process.objective?.substring(0, 120)}
                        {process.objective?.length > 120 ? '...' : ''}
                      </p>
                      <div className="card-meta">
                        <span>{process.steps?.length || 0} pasos</span>
                        {process.approvedBy && (
                          <span>• Aprobado: {process.approvedBy}</span>
                        )}
                      </div>
                      <div className="card-actions">
                        <button
                          className="btn btn-view"
                          onClick={() => setPreviewProcess(process)}
                        >
                          👁 Ver
                        </button>
                        <button
                          className="btn btn-pdf"
                          onClick={() => generatePDF(process)}
                        >
                          📥 PDF
                        </button>
                        <button
                          className="btn btn-edit"
                          onClick={() => handleEdit(process)}
                        >
                          ✏️ Editar
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDelete(process.id)}
                        >
                          🗑
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ── PREVIEW VIEW ── */}
        {previewProcess && view === 'list' && (
          <div className="preview-wrapper">
            <button
              className="btn btn-secondary back-btn"
              onClick={() => setPreviewProcess(null)}
            >
              ← Volver a la lista
            </button>

            <div className="preview-doc">
              <div className="doc-header">
                {previewProcess.headerImage && (
                  <img
                    src={previewProcess.headerImage}
                    alt=""
                    className="doc-header-bg"
                  />
                )}
                <div className="doc-header-content">
                  <BlueExpressLogo width={120} white={true} />
                  <span className="doc-label">DOCUMENTACIÓN DE PROCESO</span>
                  <h2 className="doc-title">{previewProcess.name}</h2>
                  <div className="doc-meta-row">
                    <span>Versión {previewProcess.version}</span>
                    <span>•</span>
                    <span>{previewProcess.date}</span>
                    {previewProcess.approvedBy && (
                      <>
                        <span>•</span>
                        <span>Aprobado por: {previewProcess.approvedBy}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="doc-body">
                <div className="doc-section">
                  <h3 className="doc-section-title">Objetivo</h3>
                  <p className="doc-text">{previewProcess.objective}</p>
                </div>

                {previewProcess.requirements && (
                  <div className="doc-section">
                    <h3 className="doc-section-title">Requisitos</h3>
                    <p className="doc-text">{previewProcess.requirements}</p>
                  </div>
                )}

                <div className="doc-section">
                  <h3 className="doc-section-title">Pasos del Proceso</h3>
                  <div className="steps-timeline">
                    {previewProcess.steps.map((step, i) => {
                      const text = getStepText(step);
                      const img = getStepImage(step);
                      if (!text?.trim() && !img) return null;
                      return (
                        <div key={i} className="timeline-item">
                          <div className="timeline-dot">
                            <span>{i + 1}</span>
                          </div>
                          <div className="timeline-content">
                            <p className="doc-text">{text}</p>
                            {img && (
                              <img
                                src={img}
                                alt={`Paso ${i + 1}`}
                                className="step-preview-image"
                              />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {previewProcess.risks && (
                  <div className="doc-section doc-section-risk">
                    <h3 className="doc-section-title risk-title">
                      ⚠ Riesgos Identificados
                    </h3>
                    <p className="doc-text">{previewProcess.risks}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── FORM VIEW ── */}
        {view === 'form' && (
          <div>
            <button
              className="btn btn-secondary back-btn"
              onClick={() => {
                resetForm();
                setIsEditing(false);
                setView('list');
              }}
            >
              ← Volver
            </button>

            <div className="form-container">
              <div className="form-header">
                <h2>{isEditing ? 'Editar Proceso' : 'Nuevo Proceso'}</h2>
                <p>Completa los campos para documentar el proceso</p>
              </div>

              <form onSubmit={handleSubmit} className="form-body">
                {/* Imagen de portada */}
                <div className="form-group">
                  <label>Imagen de portada (opcional)</label>
                  <div
                    className="image-dropzone"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {formData.headerImage ? (
                      <div className="dropzone-preview">
                        <img src={formData.headerImage} alt="" />
                        <button
                          type="button"
                          className="remove-img-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            setFormData((prev) => ({ ...prev, headerImage: null }));
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <div className="dropzone-placeholder">
                        <span className="dropzone-icon">🖼</span>
                        <span>Click para agregar imagen de portada</span>
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={(e) => handleHeaderImage(e.target.files[0])}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Nombre del Proceso *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Ej: Proceso de Aprobación de Compras"
                    required
                  />
                </div>

                <div className="form-row-inline">
                  <div className="form-group">
                    <label>Versión</label>
                    <input
                      type="text"
                      name="version"
                      value={formData.version}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Fecha</label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Objetivo del Proceso *</label>
                  <textarea
                    name="objective"
                    value={formData.objective}
                    onChange={handleInputChange}
                    placeholder="Describe el objetivo y propósito de este proceso"
                    required
                    rows="4"
                  />
                </div>

                <div className="form-group">
                  <label>Requisitos</label>
                  <textarea
                    name="requirements"
                    value={formData.requirements}
                    onChange={handleInputChange}
                    placeholder="Lista los requisitos necesarios para ejecutar este proceso"
                    rows="3"
                  />
                </div>

                {/* Pasos con imágenes */}
                <div className="form-group">
                  <div className="form-group-header">
                    <label>Pasos del Proceso *</label>
                    <button
                      type="button"
                      onClick={addStep}
                      className="btn btn-add-step"
                    >
                      + Agregar paso
                    </button>
                  </div>
                  {formData.steps.map((step, index) => (
                    <div key={index} className="step-input">
                      <span className="step-number">{index + 1}</span>
                      <div className="step-content">
                        <textarea
                          value={step.text}
                          onChange={(e) =>
                            handleStepChange(index, e.target.value)
                          }
                          placeholder={`Describe el paso ${index + 1} detalladamente`}
                          rows="2"
                        />
                        {/* Imagen del paso */}
                        {step.image ? (
                          <div className="step-img-preview">
                            <img src={step.image} alt="" />
                            <button
                              type="button"
                              className="remove-step-img"
                              onClick={() => removeStepImage(index)}
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            className="btn-add-image"
                            onClick={() => {
                              const input = document.createElement('input');
                              input.type = 'file';
                              input.accept = 'image/*';
                              input.onchange = (e) =>
                                handleStepImage(index, e.target.files[0]);
                              input.click();
                            }}
                          >
                            🖼 Agregar imagen al paso
                          </button>
                        )}
                      </div>
                      {formData.steps.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeStep(index)}
                          className="btn btn-remove"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="form-group">
                  <label>Riesgos Identificados</label>
                  <textarea
                    name="risks"
                    value={formData.risks}
                    onChange={handleInputChange}
                    placeholder="Describe los riesgos potenciales asociados a este proceso"
                    rows="3"
                  />
                </div>

                <div className="form-group">
                  <label>Aprobado por</label>
                  <input
                    type="text"
                    name="approvedBy"
                    value={formData.approvedBy}
                    onChange={handleInputChange}
                    placeholder="Nombre y cargo del aprobador"
                  />
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">
                    {isEditing ? '💾 Guardar Cambios' : '💾 Guardar Proceso'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      resetForm();
                      setIsEditing(false);
                      setView('list');
                    }}
                    className="btn btn-secondary"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <BlueExpressLogo width={100} white={false} />
        <p>Documentador de Procesos — Blue Express</p>
      </footer>
    </div>
  );
}

export default App;
