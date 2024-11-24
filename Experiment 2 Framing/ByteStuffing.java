import java.util.Scanner;

public class ByteStuffing {
	public static void main(String[] args) {
		Scanner sc = new Scanner(System.in);
		System.out.println("Enter string : ");
		String str = sc.nextLine();
		System.out.println("Enter start charachter :");
		char start = sc.next().charAt(0);
		System.out.println("Enter end charachter :");
		char end = sc.next().charAt(0);
		System.out.println("Enter escape charachter :");
		char esc = sc.next().charAt(0);
		StringBuilder result = new StringBuilder();
		for (char c : str.toCharArray()) {
			if (c == start || c == end) {
				result.append(esc);
			}
			result.append(c);
		}
		System.out.println("Output :" + start + result.toString() + end);
		sc.close();
	}
}
