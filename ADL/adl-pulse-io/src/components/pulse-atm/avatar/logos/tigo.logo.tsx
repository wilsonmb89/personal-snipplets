import { h } from '@stencil/core';

export function getLogo(size: '24px' | '32px'): any {
  return <div>
    <svg width={size} height={size} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 17">
      <g fill="none" fill-rule="evenodd">
        <g fill="#012E6E">
          <g>
            <path d="M11.376 12.418c.538.675 1.144 1.314 1.893 1.766.903.562 1.983.826 3.048.789 1.409-.02 2.823-.51 3.883-1.434.39-.314.685-.718.99-1.109.007.573.065 1.166-.141 1.714-.253.81-.92 1.41-1.62 1.863-.968.624-2.126.987-3.288.937-1.495-.053-2.985-.677-3.997-1.771-.284-.304-.526-.654-.641-1.054-.196-.546-.145-1.134-.127-1.7zm3.127-8.6c.55.105 1.118.39 1.374.906.2.366.12.794.135 1.19l-.221.003c-.613-.448-1.397-.599-2.146-.607-.705-.012-1.437.263-1.882.815-.354.412-.496.968-.466 1.499.018.589.17 1.22.615 1.644.476.478 1.199.607 1.853.58.247-.015.59-.082.624-.375.031-.643.022-1.294-.128-1.923.349.009.697-.011 1.045.01.445.042.871.418.841.881-.03.64.099 1.32-.184 1.923-.253.543-.845.831-1.414.944-1.093.209-2.28.112-3.259-.436-.837-.45-1.483-1.235-1.722-2.147-.266-1.009-.154-2.133.388-3.038.476-.811 1.291-1.402 2.192-1.685.755-.234 1.572-.326 2.355-.185zm7.93.42c.87.568 1.397 1.551 1.514 2.559.095.92-.033 1.885-.495 2.701-.414.747-1.136 1.326-1.976 1.542-1.021.269-2.19.174-3.066-.444-.816-.557-1.3-1.494-1.43-2.448-.11-.915.019-1.875.457-2.697.295-.557.751-1.037 1.318-1.333.473-.255 1.011-.379 1.547-.41.742-.045 1.509.12 2.131.53zm-20.602-2c-.002.54-.003 1.08 0 1.621.839-.002 1.676-.001 2.514 0-.013.299.022.6-.024.897-.099.421-.546.67-.963.677-.509.007-1.018.005-1.527 0-.003.965 0 1.93 0 2.894-.001.376.1.8.436 1.022.34.222.77.183 1.156.16.322-.02.63-.117.92-.252-.022.422.082.885-.16 1.265-.233.375-.695.522-1.116.565-.58.045-1.18-.013-1.716-.246C.83 10.62.42 10.17.23 9.648c-.158-.422-.207-.875-.2-1.322V4.118c.006-.357.047-.734.257-1.038.206-.298.45-.588.783-.755.235-.12.508-.084.762-.087zm3.826 1.778c.422.014.88-.05 1.259.175.371.203.54.636.541 1.038.007.954 0 1.907.004 2.862.003.31-.021.623.035.93.032.192.14.386.324.474.333.174.725.133 1.089.136-.005.373.04.783-.173 1.113-.17.26-.504.333-.797.344-.596.022-1.242-.107-1.68-.532-.46-.438-.603-1.096-.602-1.704V4.016zm14.311 1.322c-.362.087-.667.341-.847.658-.288.491-.323 1.076-.296 1.63.027.523.144 1.074.497 1.483.383.437 1.027.552 1.582.448.432-.087.787-.407.967-.796.236-.498.26-1.065.219-1.605-.048-.53-.186-1.096-.593-1.474-.398-.38-1.006-.453-1.529-.344zM7.572 2.025c.205.624-.336 1.333-1 1.326-.576.034-1.085-.483-1.076-1.043-.01-.469.345-.904.807-1.01.532-.131 1.13.202 1.27.727zM22.04.308c.598.233 1.167.596 1.538 1.122.304.453.243 1.015.235 1.53-.31-.324-.62-.656-1.004-.9-.76-.517-1.718-.713-2.631-.611-1.116.082-2.207.612-2.876 1.505.01-.437-.073-.901.118-1.314.254-.581.824-.952 1.381-1.222 1.001-.488 2.203-.505 3.239-.11z" transform="translate(-187.000000, -502.000000) translate(187.000000, 502.000000)" />
          </g>
        </g>
      </g>
    </svg>
  </div>;
}