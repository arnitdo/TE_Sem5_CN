import java.util.Scanner;

public class BitStuffing {
	public static void main(String[] args) {
		Scanner sc = new Scanner(System.in);
		System.out.println("Enter string sequence :");
		String str = sc.nextLine();
		StringBuilder result = new StringBuilder();
		int count = 0;
		for (char c : str.toCharArray()) {
			if (c == 1) {
				count++;
				result.append(c);
				if (count == 5) {
					result.append(0);
					count = 0;
				}
			} else {
				result.append(c);
				count = 0;
			}
		}
		System.out.println("Output : " + result.toString());
		sc.close();
	}
}
