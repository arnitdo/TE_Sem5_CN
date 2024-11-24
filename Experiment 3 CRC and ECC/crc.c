#include <stdio.h>

int get_bit_count(int num)
{
	int bit_shift = 1;
	while (num >= (1 << bit_shift))
	{
		bit_shift++;
	}
	return bit_shift;
}
int calculate_crc(int payload, int divisor)
{
	int div_bit_count = get_bit_count(divisor);
	int payload_bit_count = get_bit_count(payload);
	int shifted_payload = payload << (div_bit_count - 1);
	int shifted_payload_bit_count = get_bit_count(shifted_payload);
	int div_shift_bit_count = shifted_payload_bit_count - div_bit_count;
	int shifted_div = divisor << div_shift_bit_count;
	printf("Payload: %016b [%d]\nDivisor: %016b [%d]\nShiftPl: %016b [%d]\n", payload, payload_bit_count, divisor, div_bit_count, shifted_payload, shifted_payload_bit_count);
	printf("ShiftDv: %016b [%d]\n", shifted_div, div_shift_bit_count);
	while (div_shift_bit_count)
	{
		printf("[%d] %016b ^ %016b = %016b\n", div_shift_bit_count, shifted_payload, shifted_div, shifted_payload ^ shifted_div);
		shifted_payload ^= shifted_div;
		shifted_div >>= 1;
		div_shift_bit_count -= 1;
	}
	return shifted_payload & ((1 << (div_bit_count - 1)) - 1);
}

int main()
{
	int payload = 0;
	int divisor = 1;
	printf("Enter payload: ");
	scanf(" %d", &payload);
	printf("Enter divisor: ");
	scanf(" %d", &divisor);
	int crc = calculate_crc(payload, divisor);
	printf("Calculated CRC is %b\n", crc);
}