#include <stdio.h>
#include <math.h>
#include <stdlib.h>

int get_bit_count(int num)
{
	int bit_shift = 1;
	while (num >= (1 << bit_shift))
	{
		bit_shift++;
	}
	return bit_shift;
}

int get_parity_bit_count(int message)
{
	int m = get_bit_count(message);
	int p = 1;
	while ((1 << p) < (p + m + 1))
	{
		p++;
	}
	return p;
}

int get_bit_from_lsb(int val, int pos)
{
	return (!!(val & 1 << pos)) ? 1 : 0;
}

int get_bit_from_msb(int val, int pos)
{
	int bc = get_bit_count(val);
	return get_bit_from_lsb(val, bc - (pos + 1));
}

int calculate_hamming_code(int message)
{
	int m = get_bit_count(message);
	int p = get_parity_bit_count(message);
	int total_bit_count = m + p;
	// printf("Using %d bits for the message with %d m bits and %d p bits\n");
	int *parity_offset_map = malloc(sizeof(int) * p);
	if (parity_offset_map == NULL)
	{
		return 0;
	}
	int ham_mask = 0;
	for (int p_bit_msb_offset_mul = 0; p_bit_msb_offset_mul < p; p_bit_msb_offset_mul++)
	{
		int parity_bit_offset = ((total_bit_count - 1) - ((1 << p_bit_msb_offset_mul) - 1));
		*(parity_offset_map + p_bit_msb_offset_mul) = parity_bit_offset;
		ham_mask |= 1 << parity_bit_offset;
	}

	int ham_code = 0;
	int src_bit_index = 0;
	for (int i = 0; i < total_bit_count; i++)
	{
		int is_mask = get_bit_from_lsb(ham_mask, i);
		if (is_mask)
		{ /* Do nothing */
		}
		else
		{
			// Get the bit from the actual value
			int src_bit = get_bit_from_lsb(message, src_bit_index);
			ham_code |= src_bit << i;
			src_bit_index++;
		}
	}

	// printf("Your Message in Binar: %032b\n", message);
	// printf("Hamming Bit Positions: %032b\n", ham_mask);
	// printf("Code with Mesg Filled: %032b\n", ham_code);

	for (int i = 0; i < p; i++)
	{
		int pos = 1 << i;
		// Start with 1 for odd parity, 0 for even parity
		int parity = 0;
		for (int j = 1; j < total_bit_count + 1; j++)
		{
			// Easier to count 1, 3, 5, 7 rather than 0, 2, 4, 6
			int real_pos = j - 1;
			if (j & pos)
			{
				// The position is covered by the current hamming bit
				// This also includes the hamming bit as well,
				// but it will be set to 0 always, giving us the parity value in the end
				int pos_bit = get_bit_from_msb(ham_code, real_pos);
				parity ^= pos_bit;
			}
		}

		// Good thing we are keeping track of where the parity bit will end
		int par_offset_from_lsb = parity_offset_map[i];
		ham_code |= parity << par_offset_from_lsb;
	}

	// printf("Code with Hamming ECC: %032b\n", ham_code);
	// printf("Code only Hamming Bit: %032b\n", ham_code & ham_mask);

	return ham_code;
}

int main()
{
	int message = 0;
	printf("Enter message: ");
	scanf(" %d", &message);
	// Break the message into 4-bit nibbles
	int message_bit_count = get_bit_count(message);
	int message_nibble_count = ceil(message_bit_count / 4.0f);
	int *message_nibbles = malloc(sizeof(int) * message_nibble_count);
	for (int lsn_idx = 0; lsn_idx < message_nibble_count; lsn_idx++)
	{
		int nibble_mask = 0b1111 << (4 * lsn_idx);
		int nibble_data = message & nibble_mask;
		int shifted_nibble = nibble_data >> (4 * lsn_idx);
		message_nibbles[message_nibble_count - (lsn_idx + 1)] = shifted_nibble;
		printf("%04b\n", shifted_nibble);
	}

	for (int lsn_idx = 0; lsn_idx < message_nibble_count; lsn_idx++)
	{
		int nibble = message_nibbles[message_nibble_count - (lsn_idx + 1)];
		int nibble_with_hc = calculate_hamming_code(nibble);
		printf("%04b => %07b\n", nibble, nibble_with_hc);
		message_nibbles[message_nibble_count - (lsn_idx + 1)] = nibble_with_hc;
	}

	for (int nib_idx = 0; nib_idx < message_nibble_count; nib_idx++)
	{
		printf("%07b", message_nibbles[nib_idx]);
	}

	return 0;
}